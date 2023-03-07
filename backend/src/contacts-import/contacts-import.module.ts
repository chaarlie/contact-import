import { Module } from '@nestjs/common';
import { ContactService } from '../contact/service/contact.service';
import { UserService } from '../user/services/user.service';
import { ContactsImportService } from './services/contacts-import.service';

@Module({
  providers: [ContactsImportService, UserService, ContactService],
  exports: [ContactsImportService],
})
export class ContactsImportModule {}
