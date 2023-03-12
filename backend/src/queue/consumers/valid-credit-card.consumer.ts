import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import lookupImport = require('binlookup');
import { ContactService } from '../../contact/service/contact.service';
import { CsvContactDto } from '../../lib/dtos/csv-contact.dto';
import { ContactsImportService } from '../../contacts-import/services/contacts-import.service';
import { ContactErrorLogDto } from '../../lib/dtos/contact-error-log.dto';
import { QUEUES } from '../../lib/enums/queues.enum';
import { JOBS } from '../../lib/enums/jobs.enum';

@Processor(QUEUES.MAIN_QUEUE)
export class ValidCreditCardConsumer {
  constructor(
    private contactService: ContactService,
    private contactImportService: ContactsImportService,
  ) {}
  @OnQueueCompleted()
  saveContacts(job: Job) {
    const { contacts } = job.data;
    this.contactImportService.saveContacts(contacts);
  }
  @Process(JOBS.CREDIT_CARD_JOB)
  async readOperationJob(job: Job<unknown>): Promise<void> {
    let throttle = 0;

    const { contacts } = job.data as { contacts: CsvContactDto[] };

    for (const contact of contacts) {
      try {
        const { creditCardNumber } = contact;
        contact.creditCardNumber =
          this.contactService.encryptCard(creditCardNumber);
        contact.creditCardNetwork = await this.getCardNetwork(creditCardNumber);

        throttle++;

        if (throttle === 10) {
          // Free requests are throttled at 10 per minute on https://binlist.net/
          await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
          throttle = 0;
        }
      } catch (error) {
        const log = {
          message: `Error while processing credit card of user ${contact.email}`,
          user: contact.user,
          importFile: contact.importFile,
        } as ContactErrorLogDto;
        await this.contactImportService.saveContactErrorLog([log]);

        console.error(error);
      }
    }
  }

  async getCardNetwork(card: string): Promise<any> {
    const lookup = lookupImport();

    const response = await lookup(card);
    if (!response) throw new Error(`Invalid card ${card}`);
    return response.brand ? response.brand : response.scheme;
  }
}
