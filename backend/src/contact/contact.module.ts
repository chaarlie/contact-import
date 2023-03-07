import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { ContactService } from './service/contact.service';

@Module({
  providers: [ContactService, UserService],
  exports: [ContactService],
})
export class ContactModule {}
