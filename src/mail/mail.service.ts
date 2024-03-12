import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { APPLICATION_NAME } from '../Helpers/Config';

interface Email {
  to: string;
  data: any;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data: { email: string; name: string }) {
    const { email, name } = data;
    console.log(name);
    const subject = `Welcome to Company: ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'welcome',
      context: {
        name,
      },
    });
  }
  async sendOtp(data: { email: string; name: string; otp: string }) {
    const { email, name, otp } = data;
    console.log(name);
    const subject = `Account Verification - ${APPLICATION_NAME}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'verifyOTP',
      context: {
        name,
        appName: APPLICATION_NAME,
        otp,
      },
    });
  }
}
