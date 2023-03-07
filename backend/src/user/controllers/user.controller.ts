import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { ContactService } from '../../contact/service/contact.service';
import { CreateUserDto } from '../../lib/dtos/create-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private contactService: ContactService,
  ) {}

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.saveUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('import-contact-list')
  public getImportList(@Req() req, @Paginate() query: PaginateQuery) {
    return this.contactService.getUserImportedContacts(
      req.user.username,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('failed-contact-list')
  getFailedList(@Req() req) {
    return this.userService.getUserFailedImportedContacts(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('processed-file-list')
  getProcessedFileList(@Req() req) {
    return this.userService.getUserProcessedFiles(req.user.username);
  }
}
