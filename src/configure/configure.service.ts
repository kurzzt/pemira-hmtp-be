import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Configure } from './schema/configure.schema';
import { Model } from 'mongoose';
import { UpdateConfigureDto } from './dto/update-configure.dto';

@Injectable()
export class ConfigureService {
  constructor(
    @InjectModel(Configure.name)
    private configureModel: Model<Configure>,
  ) { }

  async update(body: UpdateConfigureDto){
    const { start_date, end_date, active } = body

    const response = await this.configureModel.findOneAndUpdate(
      {},
      { start_date, end_date, active },
      { new: true, runValidators: true })
    return response
  }

  async find(){
    const response = await this.configureModel.findOne()
    return response
  }
}
