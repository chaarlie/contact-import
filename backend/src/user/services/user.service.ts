import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../../lib/dtos/create-user.dto';
import User from '../../lib/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  async saveUser(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;
    const found = await this.dataSource
      .getRepository(User)
      .findOneBy({ username });

    if (found) {
      throw new HttpException(
        `user with username ${username} exists`,
        HttpStatus.CONFLICT,
      );
    }

    return this.dataSource.getRepository(User).save(createUserDto);
  }

  findByUserName(username: string): Promise<User> {
    return this.dataSource.getRepository(User).findOneBy({ username });
  }

  getUserFailedImportedContacts(username): Promise<User[]> {
    return this.dataSource.getRepository(User).find({
      relations: ['importLogs'],
      where: {
        username,
      },
    });
  }

  getUserProcessedFiles(username): Promise<User[]> {
    return this.dataSource.getRepository(User).find({
      relations: ['importFiles'],
      where: {
        username,
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.dataSource.getRepository(User).findOneBy({ id });

    if (!found)
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    return found;
  }
}
