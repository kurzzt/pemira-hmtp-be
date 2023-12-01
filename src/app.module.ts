import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { PairModule } from './pair/pair.module';
import { IsEmailUniqueConstraint } from './user/uniqueEmail.decorator';
import { IsNIMUniqueConstraint } from './user/uniqueNIM.decorator';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { ConfigureModule } from './configure/configure.module';
const normalize = require('@meanie/mongoose-to-json');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB,
        connectionFactory: (connection) => {
          connection.plugin(normalize)
          return connection
        }
      })
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
    ConfigureModule,
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
