import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactService } from '../contact/service/contact.service';
import { ContactsImportService } from '../contacts-import/services/contacts-import.service';
import { QUEUES } from '../lib/enums/queues.enum';
import { UserService } from '../user/services/user.service';
import { SocketGateway } from '../websocket/gateways/socket.gateway';
import { ValidCreditCardConsumer } from './consumers/valid-credit-card.consumer';
import { ValidCreditCardProducer } from './producers/valid-credit-card.producer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.CACHE_PORT,
      },
    }),
    BullModule.registerQueue({
      name: QUEUES.MAIN_QUEUE,
    }),
  ],
  providers: [
    UserService,
    ContactService,
    ContactsImportService,
    ValidCreditCardConsumer,
    ValidCreditCardProducer,
    SocketGateway,
  ],
  exports: [ValidCreditCardConsumer, ValidCreditCardProducer],
})
export class QueueModule {}
