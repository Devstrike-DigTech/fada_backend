import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../mail/mail.service';
import { PcnService } from "../Externals/Pcn.service";
import { PcnRepository } from "../Externals/Pcn.repository";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, PcnRepository, RefreshTokenStrategy, EmailService, PcnService],
})
export class AuthModule {}
