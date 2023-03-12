import ImportFile from '../entities/import-file.entity';
import User from '../entities/user.entity';

export interface ContactErrorLogDto {
  message: string;
  user: User;
  importFile: ImportFile;
}
