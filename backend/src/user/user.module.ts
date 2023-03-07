import { Module } from '@nestjs/common';
import { ContactService } from '../contact/service/contact.service';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService, ContactService],
  exports: [UserService],
})
export class UserModule {}
