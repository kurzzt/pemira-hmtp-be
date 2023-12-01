import { BadRequestException, ForbiddenException, ImATeapotException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { LoginDto } from './auth/login.dto';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user/schema/user.schema';
import { PairService } from './pair/pair.service';
import { VoteService } from './vote/vote.service';
import { ConfigureService } from './configure/configure.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private pairService: PairService,
    private voteService: VoteService,
    private configureService: ConfigureService,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService
  ){}
  
  getHello(): string {
    return 'Hello World!';
  }

  // NOTE: ALL IN ONE GUARDS
  async login(body: LoginDto){
    const { user, password } = body

    const validate = await this.userService.login(user)
    if(!validate) throw new UnauthorizedException("Invalid user or password")

    let account: User
    if(validate.isAdmin) {
      account = await this.userService.adminLoginMethod(user)
    } else {
      account = await this.userService.nonAdminLoginMethod(user)
    }

    if(!Object.keys(account || {}).length) throw new UnauthorizedException("Invalid user or password")
    
    const isPasswordMatched = await bcrypt.compare(password, account.password)
    if(!isPasswordMatched) throw new UnauthorizedException('Invalid user or password')

    if(!account.isAdmin) {
      const { active, start_date, end_date } = await this.configureService.find()
      const date = new Date
      if(active && !(date > start_date && date < end_date)) throw new ImATeapotException('Please wait until election date')
    }

    if(account.voted) throw new ForbiddenException(`The ${account.name} account has voted, you can't access the source again`)

    const payload = { sub: account['_id'] }
    return {
      user: account,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async uploadSingleFile(file: Express.Multer.File): Promise<Record<string, string>>{
    const response = await this.cloudinary.uploadImage(file)
    return response
  }

  async dashboard(){
    const totalPair = await this.pairService.totalPair()
    const totalDPT = await this.userService.totalNonAdminUser()
    const totalVote = await this.voteService.totalVote()
    const statVote = await this.voteService.stat_groupbyPair()

    return { totalPair, totalDPT, totalVote, statVote }
  }

  async reset_db(){
    try{
      await this.voteService.deleteAll()
      await this.userService.deleteAllNonAdmin()
      await this.pairService.deleteAll()
      
      return { message: "Success" }
    }catch(e){
      throw new BadRequestException(e)
    }
  }
}
