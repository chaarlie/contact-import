import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CsvContactDto } from '../../lib/dtos/csv-contact.dto';
import { JOBS } from '../../lib/enums/jobs.enum';
import { QUEUES } from '../../lib/enums/queues.enum';

@Injectable()
export class ValidCreditCardProducer {
  constructor(@InjectQueue(QUEUES.MAIN_QUEUE) private readonly queue: Queue) {}

  addContacts(contacts: CsvContactDto[]) {
    this.queue.add(JOBS.CREDIT_CARD_JOB, { contacts });
  }
}
