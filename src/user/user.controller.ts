import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
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
          maxSize: 10000000,
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

  @Delete(':id')
    async delete(@Param('id', ValidateUserParamId) id: string) {
      return this.userService.deleteUserById(id);
    }

  @Get()
  async findAll(@Query() q: ExpressQuery): Promise<User[]> {
    return this.userService.findAllNonAdmin(q);
  }

  @Get('admin')
  async findAllAdmin(@Query() q: ExpressQuery): Promise<User[]> {
    return this.userService.findAllAdmin(q);
  }

  @Get(':id')
  async find(@Param('id', ValidateUserParamId) id: string) {
    return this.userService.findUserById(id);
  }
}
