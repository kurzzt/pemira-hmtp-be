import { Module } from '@nestjs/common';
import { PairService } from './pair.service';
import { PairController } from './pair.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PairSchema } from './schema/pair.schema';
import { VoteModule } from 'src/vote/vote.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Pair',
        schema: PairSchema,
      },
    ]),
    VoteModule
  ],
  controllers: [PairController],
  providers: [PairService],
  exports: [PairService]
})
export class PairModule {}
