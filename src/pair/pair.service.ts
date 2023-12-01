import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pair } from './schema/pair.schema';
import { Model } from 'mongoose';
import { CreatePairDto } from './dto/create-pair.dto';
import { UpdatePairDto } from './dto/update-pair.dto';
import { Query } from 'express-serve-static-core';
import { VoteService } from 'src/vote/vote.service';

@Injectable()
export class PairService {
  constructor(
    @InjectModel(Pair.name)
    private pairModel: Model<Pair>,
    private voteService: VoteService,
  ) {}

  async isExist(id: string) {
    return await this.pairModel.findById(id);
  }

  async createPair(body: CreatePairDto): Promise<Pair> {
    const { leader, subLeader, visi, misi, number, imgURL } = body;
    const response = await this.pairModel.create({
      leader, subLeader, visi, misi, number, imgURL
    });

    return response;
  }

  async updatePairById(id: string, body: UpdatePairDto): Promise<Pair> {
    const { leader, subLeader, visi, misi, number, imgURL } = body;

    const response = await this.pairModel.findByIdAndUpdate(
      id,
      { leader, subLeader, visi, misi, number, imgURL },
      { new: true, runValidators: true },
    );

    return response;
  }

  async deleteAll() {
    return await this.pairModel.deleteMany({})
  }

  // NOTE: DELETE PAIR WILL DELETE VOTE WITH PAIR ID
  async deletePairById(id: string): Promise<Pair> {
    const response = await this.pairModel.findByIdAndDelete(id);
    await this.voteService.deleteVoteWithPairID(response._id)
    return response;
  }

  async findPairById(id: string): Promise<Pair> {
    const response = await this.pairModel.findById(id);
    return response;
  }

  async findAllPair(q: Query): Promise<Pair[]> {
    const response = await this.pairModel.find({})
    return response;
  }

  async totalPair(){
    const response = await this.pairModel.countDocuments()
    return response
  }
}
