import { FileValidator } from '@nestjs/common';

export class CsvColumnCountValidator extends FileValidator {
  isValid(arg: any): boolean | Promise<boolean> {
    const { buffer } = arg;
    const lines = buffer.toString('utf-8').split(/\n/);
    const existRowWithout7Cols = !lines.some(
      (line) => line.split(',').length !== 6,
    );

    return existRowWithout7Cols;
  }
  buildErrorMessage(): string {
    return 'Invalid column structure';
  }
}
