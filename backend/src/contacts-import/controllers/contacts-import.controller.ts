import {
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvParsePipe } from '../pipes/csv-parse.pipe';
import { CsvColumnCountValidator } from '../validators/csv-column-count.validator';
import { CsvColumnHeaderValidator } from '../validators/csv-column-header.validator';
import { ContactsImportService } from '../services/contacts-import.service';
import { CsvImportDto } from '../../lib/dtos/csv-import.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExtractUserColumnsPipe } from '../pipes/extract-user-column.pipe';

@Controller('contacts-import')
export class ContactsImportController {
  constructor(private contactsImportService: ContactsImportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async uploadDocument(
    @UploadedFile(
      ExtractUserColumnsPipe,
      new ParseFilePipe({
        validators: [
          new CsvColumnCountValidator({}),
          new CsvColumnHeaderValidator({}),
        ],
      }),
      new CsvParsePipe(),
    )
    csvImportDto: CsvImportDto,
    @Req() req,
  ) {
    return this.contactsImportService.processImportedContacts(
      req.user,
      csvImportDto,
    );
  }
}
