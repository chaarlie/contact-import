import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactsImportService } from './contacts-import/services/contacts-import.service';
import { DatabaseConfiguration } from './database.configuration';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';
import { ContactsImportModule } from './contacts-import/contacts-import.module';
import { ContactsImportController } from './contacts-import/controllers/contacts-import.controller';
import { ContactService } from './contact/service/contact.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ContactsImportModule,
    ContactModule,
  ],
  controllers: [ContactsImportController, UserController],
  providers: [ContactsImportService, UserService, ContactService],
})
export class AppModule {}