import ImportFile from '../entities/import-file.entity';
import User from '../entities/user.entity';
import { CsvContact } from '../types/types';

export interface CsvContactDto extends CsvContact {
  error?: Error;
  user: User;
  importFile: ImportFile;
}
