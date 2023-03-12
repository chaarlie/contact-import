import { CsvContact } from '../types/types';

export interface CsvImportDto {
  contacts: CsvContact[];
  fileName: string;
}
