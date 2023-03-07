import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ImportStatus {
  OnHold = 'On Hold',
  Processing = 'Processing',
  Failed = 'Failed',
  Finished = 'Finished',
}

import Contact from './contact.entity';
import User from './user.entity';

@Entity({ name: 'import_file' })
export default class ImportFile {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  successfulContacts: number;

  @Column({ nullable: true })
  failedContacts: number;

  @Column({
    type: 'enum',
    enum: ImportStatus,
  })
  status: ImportStatus;

  @OneToMany(() => Contact, (contact) => contact.importFile)
  contacts: Contact[];

  @ManyToOne(() => User, (user) => user.importFiles)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
