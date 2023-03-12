import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';

import { DataSource } from 'typeorm';
import { ContactService } from '../../contact/service/contact.service';
import { CsvImportDto } from '../../lib/dtos/csv-import.dto';
import Contact from '../../lib/entities/contact.entity';
import ImportFile, {
  ImportStatus,
} from '../../lib/entities/import-file.entity';
import ImportLog from '../../lib/entities/import-log.entity';
import { CsvContact } from '../../lib/types/types';
import { UserService } from '../../user/services/user.service';
import { CsvContactDto } from '../../lib/dtos/csv-contact.dto';
import { ContactErrorLogDto } from '../../lib/dtos/contact-error-log.dto';
import { ValidCreditCardProducer } from '../../queue/producers/valid-credit-card.producer';
import User from '../../lib/entities/user.entity';

@Injectable()
export class ContactsImportService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private contactService: ContactService,
    private validCreditCardProducer: ValidCreditCardProducer,
  ) {}

  verifyContactValidations(contact: CsvContact): void {
    this.isValidAddress(contact.address);
    this.isValidPhone(contact.phone);
    this.isValidDateOfBirth(contact.birth);
    this.isValidUsername(contact.username);
    this.isValidEmail(contact.email);
  }

  async saveContacts(contacts: CsvContactDto[]): Promise<void> {
    this.dataSource.transaction(async () => {
      const savedContacts = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Contact)
        .values(contacts)
        .execute();

      if (savedContacts.generatedMaps.length > 0) {
        const { importFile } = contacts[0];
        importFile.status = ImportStatus.Finished;
        await this.dataSource.getRepository(ImportFile).save(importFile);
      }
    });
  }

  async saveContactErrorLog(
    contactErrorLogs: ContactErrorLogDto[],
  ): Promise<ImportLog[]> {
    return this.dataSource.getRepository(ImportLog).save(contactErrorLogs);
  }

  isValidUsername(username: string): boolean {
    const invalidCharRegex = /[ `!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~]/;
    if (invalidCharRegex.test(username))
      throw new Error(`invalid username ${username}`);
    return true;
  }

  isValidDateOfBirth(dateOfBirth: string): boolean {
    const isValidDateOfBirthRegex = /^(\d{4}-\d{2}-\d{2})$/g;
    if (!isValidDateOfBirthRegex.test(dateOfBirth))
      throw new Error(`Invalid date ${dateOfBirth}`);
    return true;
  }

  isValidPhone(phone: string): boolean {
    const isValidPhone = /^(\(\+\d{2}\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}\s\d{2})$/g;
    if (!isValidPhone.test(phone)) throw new Error(`Invalid phone ${phone}`);
    return true;
  }

  isValidAddress(address: string): boolean {
    if (!Boolean(address.length)) throw new Error(`Invalid address ${address}`);
    return true;
  }

  isValidEmail(email: string): boolean {
    if (!isEmail(email)) throw new Error(`Invalid email ${email}`);
    return true;
  }

  verifyEmailDuplication(email: string, emailSet: Set<string>): Set<string> {
    const existIncomingDuplicate = emailSet.size === emailSet.add(email).size;

    if (existIncomingDuplicate) {
      throw new Error(`Contact email ${email} is a duplicate`);
    }
    return emailSet;
  }

  async isNotAlreadySavedEmail(email: string, user: User): Promise<boolean> {
    const previouslySavedContact = await this.contactService.findByEmail(
      email,
      user,
    );

    if (previouslySavedContact.length > 0) {
      throw new Error(`Contact email ${email} already saved`);
    }
    return true;
  }

  async verifyNoEmailDuplicate(
    email: string,
    emailSet: Set<string>,
    user: User,
  ): Promise<Set<string>> {
    await this.isNotAlreadySavedEmail(email, user);

    return this.verifyEmailDuplication(email, emailSet);
  }

  public async processImportedContacts(
    requestUser: User,
    { contacts, fileName }: CsvImportDto,
  ): Promise<void> {
    this.dataSource.transaction(async () => {
      let emailSet = new Set<string>();
      let importFile = null;
      let user = null;
      const validContact = null;
      const validContacts = [];
      const contactErrorLogs = [];

      try {
        user = await this.userService.findByUserName(requestUser.username);

        importFile = await this.dataSource.getRepository(ImportFile).save({
          fileName,
          user,
          status: ImportStatus.OnHold,
        });

        for (const contact of contacts) {
          try {
            this.verifyContactValidations(contact);

            validContacts.push({ ...contact, user, importFile });

            emailSet = await this.verifyNoEmailDuplicate(
              validContact.email,
              emailSet,
              user,
            );
          } catch (error) {
            contactErrorLogs.push({ message: error.message, user, importFile });
          }
        }

        if (contactErrorLogs.length > 0) {
          await this.saveContactErrorLog(contactErrorLogs);
        }

        if (validContacts.length === 0) {
          throw new Error('No contact could be imported');
        }

        importFile.status = ImportStatus.Processing;
        importFile = await this.dataSource
          .getRepository(ImportFile)
          .save(importFile);

        this.validCreditCardProducer.addContacts(validContacts);
      } catch (error) {
        console.error(error);

        if (!importFile) {
          await this.dataSource.getRepository(ImportFile).save({
            fileName,
            user,
            status: ImportStatus.Failed,
          });
        } else {
          importFile.status = ImportStatus.Failed;
          await this.dataSource.getRepository(ImportFile).save(importFile);
        }
        new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    });
  }
}
