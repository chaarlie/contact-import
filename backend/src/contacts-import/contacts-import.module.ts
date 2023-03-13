import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ContactService } from '../contact/service/contact.service';
import { QUEUES } from '../lib/enums/queues.enum';
import { ValidCreditCardProducer } from '../queue/producers/valid-credit-card.producer';
import { UserService } from '../user/services/user.service';
import { SocketGateway } from '../websocket/gateways/socket.gateway';
import { ContactsImportService } from './services/contacts-import.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.MAIN_QUEUE,
    }),
  ],
  providers: [
    ContactsImportService,
    UserService,
    ContactService,
    ValidCreditCardProducer,
    SocketGateway,
  ],
  exports: [ContactsImportService],
})
export class ContactsImportModule {}
