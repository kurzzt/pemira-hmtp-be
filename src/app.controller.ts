import { Body, Controller, Delete, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './auth/login.dto';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto
  ) {
    return this.appService.login(body)
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async file(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp(/(jpg|jpeg|png)$/),
        })
        .addMaxSizeValidator({
          maxSize: 50000000 //bytes
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    ) file: Express.Multer.File
  ) {
    return this.appService.uploadSingleFile(file)
  }

  @Get('dashboard')
  async dashboard() {
    return this.appService.dashboard()
  }

  @Delete('reset-all')
  async reset(){
    return this.appService.reset_db()
  }
}
