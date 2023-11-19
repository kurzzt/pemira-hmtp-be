import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vote } from './schema/vote.schema';
import { Model, Types } from 'mongoose';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Query } from 'express-serve-static-core';
import { UserService } from 'src/user/user.service';
import { flattenObject, genParam } from 'utils/common';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name)
    private voteModel: Model<Vote>,
    private userService: UserService,
  ) { }

  async isExist(id: string) {
    return await this.voteModel.findById(id);
  }

  async createVote(user: string, body: CreateVoteDto) {
    const { vote } = body;

    const isExist = await this.userService.isExist(user);
    if (!isExist) throw new BadRequestException(`User with ${isExist._id} IDs doesn't exist`);
    if (isExist.isAdmin) throw new BadRequestException('Admin not allowed to vote!');
    if (isExist.voted) throw new BadRequestException(`User with ${isExist._id} IDs already vote`)

    const response = await this.voteModel.create({
      user: new Types.ObjectId(user),
      vote: new Types.ObjectId(vote),
    });
    await this.userService.updateVoteField(user, true)
    return response
  }

  async deleteVote(id: string): Promise<Vote> {
    const response = await this.voteModel.findByIdAndDelete(id);
    await this.userService.updateVoteField((response.user).toString(), false)
    return response
  }

  async deleteVoteWithPairID(id: Types.ObjectId){
    const response = await this.voteModel.deleteMany({ vote: id })
    return response
  }

  async voteInvalid(id: string): Promise<Vote> {
    const response = await this.voteModel.findByIdAndUpdate(
      id,
      { isValid: false },
      { new: true, runValidators: true },
    );
    return response;
  }

  async findVoteById(id: string) {
    const response = await this.voteModel
      .findById(id, '-__v')
      .populate('user', '-__v')
      .populate('vote', '-__v')
    // return flattenObject(response);
    return response;
  }

  async findAllVote(q: Query) {
    const filter = {
      user: Object,
      vote: Object,
      isValid: Boolean
    };

    const { limit, skip, params, sort } = genParam(q, filter);
    const response = await this.voteModel
      .find(params)
      .populate('user', '_id name nim yearClass')
      .populate('vote', '_id number')
      .limit(limit)
      .skip(skip)
      .sort(sort);
    return response.map(x => flattenObject(x))
  }

  async totalVote() {
    const response = await this.voteModel.countDocuments()
    return response
  }

  async stat_groupbyPair() {
    const response = await this.voteModel.aggregate([
      { $match: { isValid: true } },
      { $group: {
          _id: '$vote',
          count: { $count: {} }
        }
      }
    ])
    return response
  }
}
