import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schema/user.schema';

// reference
// https://notiz.dev/blog/send-emails-with-nestjs
@Injectable()
export class MailService {
  constructor(
    private mailService: MailerService
  ) { }

  async sendCred(user: User, random_pass: string) {
    const { name, nim, email } = user

    await this.mailService.sendMail({
      to: email,
      subject: "Account Credentials Information",
      template: './sendCred',
      context: {
        name: name,
        username: nim,
        password: random_pass
      }
    })
  }
}
