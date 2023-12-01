import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ValidateUserParamId } from './validate-param-user.pipe';
import { SendBulkCredDto } from './dto/send-bulk-cred.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteBulkDto } from './dto/delete-bulk-user.dto';
import { User as UserDec } from 'src/auth/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.createUser(body);
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async postCSV(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.csv',
        })
        .addMaxSizeValidator({
          maxSize: 50000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.bulkData(file);
  }

  @Post(':id/sendCred')
  async send(
    @Param('id', ValidateUserParamId) id: string
  ){
    return this.userService.sendCredentials(id)
  }

  @Post('sendBulkCred')
  async sendBulk(
    @Body() body: SendBulkCredDto
  ){
    return this.userService.sendBulkCred(body)
  }

  @Put(':id')
  async update(
    @Param('id', ValidateUserParamId) id: string,
    @Body() body: UpdateUserDto
  ) {
    return this.userService.updateUserById(id, body)
  }

  @Delete('delete-bulk')
  async deleteAll_nonadmin(
    @Body() body: DeleteBulkDto
  ) {
    return this.userService.deleteBulk(body)
  }

  @Delete(':id')
  async delete(@Param('id', ValidateUserParamId) id: string) {
    return this.userService.deleteUserById(id);
  }

  @Get()
  async findAll(@Query() q: ExpressQuery): Promise<User[]> {
    return this.userService.findAllNonAdmin(q);
  }

  @Get('admin')
  async findAllAdmin(
    @UserDec('sub') user: string,
    @Query() q: ExpressQuery
  ){
    return this.userService.findAllAdmin(q, user);
  }

  @Get(':id')
  async find(@Param('id', ValidateUserParamId) id: string) {
    return this.userService.findUserById(id);
  }
}
