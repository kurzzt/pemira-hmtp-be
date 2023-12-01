import { Body, Controller, Get, Put } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { UpdateConfigureDto } from './dto/update-configure.dto';

@Controller('configure')
export class ConfigureController {
  constructor(private readonly configureService: ConfigureService) {}

  @Put()
  async update(
    @Body() body: UpdateConfigureDto
  ) {
    return this.configureService.update(body)
  }

  @Get()
  async find() {
    return this.configureService.find()
  }
}
