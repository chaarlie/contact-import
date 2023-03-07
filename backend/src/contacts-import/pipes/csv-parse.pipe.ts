import { Injectable, PipeTransform } from '@nestjs/common';

import { CsvImportDto } from '../../lib/dtos/csv-import.dto';
import { CsvContact } from '../../lib/types/types';

@Injectable()
export class CsvParsePipe implements PipeTransform {
  transform(value: any) {
    const { buffer, originalname: fileName } = value;
    const { userDefinedColumns } = value;

    const lines = buffer.toString('utf-8').split(/\n/);
    const header = lines[0].split(',');
    const columns = lines.slice(1);

    const headerColumns = Object.keys(userDefinedColumns).reduce(
      (container, col) => {
        container[userDefinedColumns[col]] = [];
        return container;
      },
      {},
    );

    const contacts: CsvContact[] = [];

    columns.reduce(
      (container, line) => {
        const columns = line.split(',');
        contacts.push(
          Object.keys(headerColumns).reduce((build, _, i) => {
            const colName = userDefinedColumns[header[i].trim()]
              .toLocaleLowerCase()
              .replace(/\s(.)/g, ($1) => $1.toUpperCase())
              .replace(/\s/g, '');

            build[colName] = columns[i].trim();
            return build;
          }, {} as CsvContact),
        );

        return container;
      },
      { headerColumns },
    );

    const csvImport: CsvImportDto = { contacts, fileName };

    return csvImport;
  }
}
