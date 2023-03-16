import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import Contact from './lib/entities/contact.entity';
import ImportFile from './lib/entities/import-file.entity';
import ImportLog from './lib/entities/import-log.entity';
import User from './lib/entities/user.entity';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [User, ImportFile, Contact, ImportLog],
      logging: true,
    };
  }
}
