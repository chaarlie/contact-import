import { CsvContact } from '../types/types';

export class CsvImportDto {
  contacts: CsvContact[];
  fileName: string;
}
