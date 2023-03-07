import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';

@Entity({ name: 'import_log' })
export default class ImportLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.importLogs)
  user: User;
}
