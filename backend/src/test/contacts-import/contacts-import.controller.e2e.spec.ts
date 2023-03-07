import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ContactService } from '../../contact/service/contact.service';
import { ContactsImportService } from '../../contacts-import/services/contacts-import.service';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ContactsImportController } from '../../contacts-import/controllers/contacts-import.controller';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';
import { ContactsImportModule } from '../../contacts-import/contacts-import.module';

describe('UserController', () => {
  let app: INestApplication;
  const contactsImportService = {
    saveContact: () => ({}),
  };
  const contactService = {};
  const userService = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, AuthModule, ContactsImportModule],
      providers: [
        {
          provide: AuthService,
          useValue: () => {},
        },
      ],
      controllers: [ContactsImportController],
    })
      .overrideProvider(ContactsImportService)
      .useValue(contactsImportService)
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(ContactService)
      .useValue(contactService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { username: 'chaarlie' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST contacts if columns are correct`, async () => {
    const buffer =
      Buffer.from(`birth,phone,username,credit card number,address,email
    2020-04-05, (+00) 000 111 00 00 00,New,371449635398431,Sosua,neew@otmail.com
    2021-03-29, (+53) 000 222 00 00 02,New 2,30569309025904,Los Mameyes,new2@gmail.com
    2022-03-30, (+53) 212 222 89 00 11,New 3,30569309025904,LZ,new3@gmail.com`);
    request(app.getHttpServer())
      .post('/contacts-import')
      .field('username', 'username')
      .field('birth', 'birth')
      .field('phone', 'phone')
      .field('address', 'address')
      .field('credit card number', 'credit card number')
      .field('email', 'email')
      .attach('file', buffer, 'custom_file_name.csv')
      .expect(201);
  });

  it(`/POST fails if no file is passed`, async () => {
    request(app.getHttpServer())
      .post('/contacts-import')
      .field('username', 'username')
      .field('birth', 'birth')
      .field('phone', 'phone')
      .field('address', 'address')
      .field('credit card number', 'credit card number')
      .field('email', 'email')
      .expect(500);
  });

  it(`/POST fails if defined columns and dont match`, async () => {
    const buffer =
      Buffer.from(`birth,phone,username,credit card number,address,email
    2020-04-05, (+00) 000 111 00 00 00,New,371449635398431,Sosua,neew@otmail.com
    2021-03-29, (+53) 000 222 00 00 02,New 2,30569309025904,Los Mameyes,new2@gmail.com
    2022-03-30, (+53) 212 222 89 00 11,New 3,30569309025904,LZ,new3@gmail.com`);
    request(app.getHttpServer())
      .post('/contacts-import')
      .field('username', 'username')
      .field('birth', 'birth')
      .field('phone', 'phone2')
      .field('address', 'address')
      .field('credit card number', 'credit card number')
      .field('email', 'email')
      .attach('file', buffer, 'custom_file_name.csv')
      .expect(400);
  });

  it(`/POST fails if it has missing columns`, async () => {
    const buffer =
      Buffer.from(`birth,phone2,username,credit card number,address,email
    2020-04-05, (+00) 000 111 00 00 00,New,371449635398431,Sosua,neew@otmail.com
    2021-03-29, (+53) 000 222 00 00 02,New 2,30569309025904,Los Mameyes,new2@gmail.com
    2022-03-30, (+53) 212 222 89 00 11,New 3,30569309025904,LZ,new3@gmail.com`);
    request(app.getHttpServer())
      .post('/contacts-import')
      .field('username', 'username')
      .field('birth', 'birth')
      .field('phone', 'phone2')
      .field('address', 'address')
      .field('email', 'email')
      .attach('file', buffer, 'custom_file_name.csv')
      .expect(400);
  });
});
