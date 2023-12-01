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
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './schema/vote.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ValidateVoteParamId } from './validate-param-vote.pipe';
import { User } from 'src/auth/user.decorator';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) { }

  @Post()
  async create(
    @User('sub') user: string,
    @Body() body: CreateVoteDto
  ) {
    return this.voteService.createVote(user, body);
  }

  @Put(':id')
  async invalidateVote(
    @Param('id', ValidateVoteParamId) id: string,
  ): Promise<Vote> {
    return this.voteService.voteInvalid(id);
  }

  @Delete('reset')
  async reset() {
    return this.voteService.deleteAll();
  }

  @Delete(':id')
  async delete(@Param('id', ValidateVoteParamId) id: string): Promise<Vote> {
    return this.voteService.deleteVote(id);
  }

  @Get()
  async findAll(@Query() q: ExpressQuery) {
    return this.voteService.findAllVote(q);
  }

  @Get(':id')
  async find(@Param('id', ValidateVoteParamId) id: string) {
    return this.voteService.findVoteById(id);
  }
}
