import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PairModule } from './pair/pair.module';
import { VoteModule } from './vote/vote.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsNIMUniqueConstraint } from './user/uniqueNIM.decorator';
import { IsEmailUniqueConstraint } from './user/uniqueEmail.decorator';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          }
        }
      }
    }),
    UserModule,
    PairModule,
    VoteModule,
    CloudinaryModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsNIMUniqueConstraint,
    IsEmailUniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
