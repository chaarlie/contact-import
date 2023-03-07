import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import lookupImport = require('binlookup');
import { DataSource } from 'typeorm';
import { ContactService } from '../../contact/service/contact.service';
import { CsvImportDto } from '../../lib/dtos/csv-import.dto';
import Contact from '../../lib/entities/contact.entity';
import ImportFile, {
  ImportStatus,
} from '../../lib/entities/import-file.entity';
import ImportLog from '../../lib/entities/import-log.entity';
import { CsvContact, User } from '../../lib/types/types';
import { UserService } from '../../user/services/user.service';

const lookup = lookupImport();

@Injectable()
export class ContactsImportService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private contactService: ContactService,
  ) {}

  verifyContactValidations(contact: CsvContact) {
    return new Promise((resolve, reject) => {
      try {
        this.isValidAddress(contact.address);
        this.isValidPhone(contact.phone);
        this.isValidDateOfBirth(contact.birth);
        this.isValidUsername(contact.username);
        this.isValidAddress(contact.address);
        this.isValidEmail(contact.email);

        resolve(contact);
      } catch (error) {
        reject(error);
      }
    });
  }

  saveContact(reqUser: User, csvImportDto: CsvImportDto): Promise<void> {
    return this.dataSource.transaction(async () => {
      const user = await this.userService.findByUserName(reqUser.username);
      let importFile = null;

      try {
        importFile = await this.dataSource.getRepository(ImportFile).save({
          fileName: csvImportDto.fileName,
          user,
          status: ImportStatus.OnHold,
        });
        importFile.status = ImportStatus.Processing;
        importFile = await this.dataSource
          .getRepository(ImportFile)
          .save(importFile);

        const contacts = await this.getValidContacts(
          importFile,
          user,
          csvImportDto.contacts,
        );

        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Contact)
          .values(contacts)
          .execute();

        await this.dataSource.getRepository(ImportFile).save({
          ...importFile,
          status: ImportStatus.Finished,
        });
      } catch (error) {
        if (!importFile) {
          await this.dataSource.getRepository(ImportFile).save({
            fileName: csvImportDto.fileName,
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

  async isNotAlreadySavedEmail(email: string, user): Promise<boolean> {
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

  async getCardNetwork(card: string): Promise<any> {
    const response = await lookup(card);
    if (!response) throw new Error(`Invalid card ${card}`);
    return response.brand ? response.brand : response.scheme;
  }

  public async getValidContacts(
    importFile: ImportFile,
    user,
    contacts: CsvContact[],
  ): Promise<CsvContact[]> {
    const validContacts = [];
    let emailSet = new Set<string>();

    for (const contact of contacts) {
      try {
        await this.verifyContactValidations(contact);

        contact.creditCardNetwork = await this.getCardNetwork(
          contact.creditCardNumber,
        );
        contact.creditCardNumber = this.contactService.encryptCard(
          contact.creditCardNumber,
        );

        emailSet = await this.verifyNoEmailDuplicate(
          contact.email,
          emailSet,
          user,
        );

        validContacts.push({ ...contact, user, importFile });
      } catch ({ message }) {
        await this.dataSource
          .getRepository(ImportLog)
          .save({ message, user, importFile });
      }
    }
    if (validContacts.length === 0) {
      throw new Error('No contact could be imported');
    }
    return validContacts;
  }
}
