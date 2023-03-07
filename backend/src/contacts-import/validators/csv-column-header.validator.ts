import { FileValidator } from '@nestjs/common';
import { DEFAULT_COLUMNS } from '../../lib/enums/default-enums';

export class CsvColumnHeaderValidator extends FileValidator {
  isValid(arg): boolean | Promise<boolean> {
    const { buffer, userDefinedColumns } = arg;

    const lines = buffer.toString('utf-8').split(/\n/);
    const header = lines[0].trim();

    const colSet = Object.values(DEFAULT_COLUMNS).reduce((set, col) => {
      set.add(col);
      return set;
    }, new Set());

    const hasDefaultColumnsModified = Object.values(userDefinedColumns).some(
      (col) => !colSet.has(col),
    );

    const hasAllColumnsMatching = header.split(',').every((col) => {
      return col in userDefinedColumns;
    });

    return hasAllColumnsMatching && !hasDefaultColumnsModified;
  }
  buildErrorMessage(): string {
    return 'Invalid column headers';
  }
}
