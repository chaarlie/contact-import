import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  AfterLoad,
} from 'typeorm';
import * as aes256 from 'aes256';
import ImportFile from './import-file.entity';
import User from './user.entity';

@Entity({ name: 'contact' })
export default class Contact {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  birth: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  creditCardNumber: string;

  @Column()
  creditCardNetwork: string;

  @Column()
  email: string;

  @ManyToOne(() => ImportFile, (importFile) => importFile.contacts)
  importFile: ImportFile;

  @ManyToOne(() => User, (user) => user.contacts)
  user: User;

  @AfterLoad()
  updateCounters() {
    const decryptedCard = aes256.decrypt('key', this.creditCardNumber);
    this.creditCardNumber = decryptedCard.substring(decryptedCard.length - 4);
  }
}
