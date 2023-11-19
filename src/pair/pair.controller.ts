import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PairService } from './pair.service';
import { CreatePairDto } from './dto/create-pair.dto';
import { Pair } from './schema/pair.schema';
import { UpdatePairDto } from './dto/update-pair.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ValidatePairParamId } from './validate-param-pair.pipe';

@Controller('pair')
export class PairController {
  constructor(private readonly pairService: PairService) {}

  @Post()
  async create(@Body() body: CreatePairDto): Promise<Pair> {
    return this.pairService.createPair(body);
  }

  @Put(':id')
  async update(
    @Param('id', ValidatePairParamId) id: string,
    @Body() body: UpdatePairDto,
  ): Promise<Pair> {
    return this.pairService.updatePairById(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ValidatePairParamId) id: string): Promise<Pair> {
    return this.pairService.deletePairById(id);
  }

  @Get()
  async findAll(@Query() q: ExpressQuery): Promise<Pair[]> {
    return this.pairService.findAllPair(q);
  }

  @Get(':id')
  async find(@Param('id', ValidatePairParamId) id: string): Promise<Pair> {
    return this.pairService.findPairById(id);
  }
}
