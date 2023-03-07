import * as aes256 from 'aes256';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import Contact from '../../lib/entities/contact.entity';
import User from '../../lib/entities/user.entity';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class ContactService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
  ) {}
  findByEmail(email: string, user: User): Promise<Contact[]> {
    return this.dataSource.getRepository(Contact).find({
      relations: ['user'],
      where: {
        email,
        user: { id: user.id },
      },
    });
  }

  async getUserImportedContacts(
    username: string,
    query: PaginateQuery,
  ): Promise<Paginated<Contact>> {
    const user = await this.userService.findByUserName(username);
    const UserRepository = await this.dataSource.getRepository(Contact);
    return paginate(query, UserRepository, {
      where: {
        user: {
          id: user.id,
        },
      },
      maxLimit: 5,
      sortableColumns: ['id'],
    });
  }

  encryptCard(card: string): string {
    return aes256.encrypt('key', card);
  }
}
