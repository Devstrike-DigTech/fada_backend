import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { EMAIL, EMAIL_PASSWORD, APPLICATION_NAME } from '../Helpers/Config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'yahoo',
        auth: {
          user: EMAIL,
          pass: EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${APPLICATION_NAME}" ${EMAIL}`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  // controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}
