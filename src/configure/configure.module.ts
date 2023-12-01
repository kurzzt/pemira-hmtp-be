import { Module } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { ConfigureController } from './configure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigureSchema } from './schema/configure.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Configure',
        schema: ConfigureSchema
      },
    ]),
  ],
  controllers: [ConfigureController],
  providers: [ConfigureService],
  exports: [ConfigureService]
})
export class ConfigureModule {}
