import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { ExecutionContext, INestApplication } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { ContactService } from '../../contact/service/contact.service';
import { ContactsImportService } from '../../contacts-import/services/contacts-import.service';
import { UserService } from '../../user/services/user.service';
import { UserController } from '../../user/controllers/user.controller';
import { AuthService } from '../../auth/services/auth.service';
import { AuthModule } from '../../auth/auth.module';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ContactModule } from '../../contact/contact.module';

describe('UserController', () => {
  let app: INestApplication;
  const contactsImportService = {};
  const userService = {
    getUserProcessedFiles: () => ({
      id: 17,
      username: 'chaarlie@hotmail.com',
      password: 'admin',
      created_at: '2023-03-04T00:24:23.116Z',
      updated_at: '2023-03-04T00:24:23.116Z',
      importFiles: [
        {
          id: 80,
          fileName: 'new-valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-05T07:24:20.821Z',
          updated_at: '2023-03-05T07:24:21.952Z',
        },
        {
          id: 81,
          fileName: 'new-valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-05T07:25:50.023Z',
          updated_at: '2023-03-05T07:25:50.995Z',
        },
        {
          id: 82,
          fileName: 'valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-05T07:43:13.105Z',
          updated_at: '2023-03-05T07:43:14.777Z',
        },
        {
          id: 83,
          fileName: 'valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-05T07:49:47.722Z',
          updated_at: '2023-03-05T07:49:49.926Z',
        },
        {
          id: 84,
          fileName: 'valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-05T07:52:17.245Z',
          updated_at: '2023-03-05T07:52:19.555Z',
        },
        {
          id: 85,
          fileName: 'valid - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'On Hold',
          created_at: '2023-03-06T04:05:45.602Z',
          updated_at: '2023-03-06T04:05:45.602Z',
        },

        {
          id: 91,
          fileName: 'new - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'On Hold',
          created_at: '2023-03-06T05:50:20.779Z',
          updated_at: '2023-03-06T05:50:20.779Z',
        },

        {
          id: 100,
          fileName: 'new - Hoja 1.csv',
          successfulContacts: null,
          failedContacts: null,
          status: 'Finished',
          created_at: '2023-03-06T07:27:43.627Z',
          updated_at: '2023-03-06T07:27:45.059Z',
        },
      ],
    }),
    getUserFailedImportedContacts: () => [
      {
        id: 17,
        username: 'chaarlie@hotmail.com',
        password: 'admin',
        created_at: '2023-03-04T00:24:23.116Z',
        updated_at: '2023-03-04T00:24:23.116Z',
        importLogs: [
          {
            id: 21,
            message: 'Invalid phone Arnaldo',
          },
          {
            id: 22,
            message: 'Invalid phone Elinton',
          },
        ],
      },
    ],
  };
  const contactService = {
    getUserImportedContacts: () => {
      return {
        data: [
          {
            id: 1,
            username: 'New',
            birth: '2020-04-05T04:00:00.000Z',
            phone: '(+00) 000 111 00 00 00',
            address: 'Sosua',
            creditCardNumber: '8431',
            creditCardNetwork: 'american express',
            email: 'neew@otmail.com',
          },
          {
            id: 2,
            username: 'ABC2',
            birth: '2021-03-29T04:00:00.000Z',
            phone: '(+53) 000 222 00 00 02',
            address: 'Los Mameyes',
            creditCardNumber: '5904',
            creditCardNetwork: 'discover',
            email: 'new2@gmail.com',
          },
          {
            id: 3,
            username: 'ABC3',
            birth: '2022-03-30T04:00:00.000Z',
            phone: '(+53) 212 222 89 00 11',
            address: 'LZ',
            creditCardNumber: '5904',
            creditCardNetwork: 'discover',
            email: 'new3@gmail.com',
          },
          {
            id: 4,
            username: 'ABC4',
            birth: '2020-04-05T04:00:00.000Z',
            phone: '(+00) 000 111 00 00 00',
            address: 'Arrizona',
            creditCardNumber: '8431',
            creditCardNetwork: 'american express',
            email: 'cabrera@hotmail.com',
          },
          {
            id: 5,
            username: 'ABC5',
            birth: '2021-03-29T04:00:00.000Z',
            phone: '(+53) 000 222 00 00 02',
            address: 'Cabaarrete',
            creditCardNumber: '5904',
            creditCardNetwork: 'discover',
            email: 'porche@hotmail.com',
          },
        ],
        meta: {
          itemsPerPage: 5,
          totalItems: 12,
          currentPage: 1,
          totalPages: 3,
          sortBy: [['id', 'ASC']],
        },
        links: {
          current:
            'http://localhost:3000/user/import-contact-list?page=1&limit=5&sortBy=id:ASC',
          next: 'http://localhost:3000/user/import-contact-list?page=2&limit=5&sortBy=id:ASC',
          last: 'http://localhost:3000/user/import-contact-list?page=3&limit=5&sortBy=id:ASC',
        },
      };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, AuthModule, ContactModule],
      providers: [
        {
          provide: AuthService,
          useFactory: () => {},
        },
      ],
      controllers: [UserController],
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

  it(`/GET user imported contacts`, async () => {
    const res = await request(app.getHttpServer())
      .get('/user/import-contact-list')
      .expect(200);

    expect(res.body).toMatchObject(contactService.getUserImportedContacts());
  });

  it(`/GET user processed files`, async () => {
    const res = await request(app.getHttpServer())
      .get('/user/processed-file-list')
      .expect(200);

    expect(res.body).toMatchObject(userService.getUserProcessedFiles());
  });
});
