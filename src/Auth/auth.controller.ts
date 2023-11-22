import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, VerifyOTPDTO } from './dto';
import { Cookies } from 'src/Helpers/decorators/cookies.decorator';
import { Response } from 'express';
import {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_TTL,
  REFRESH_TOKEN_TTL,
} from '../Helpers/Config';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  public async signup(@Body() body: RegisterDTO) {
    const user = await this.AuthService.register(body);

    return { data: user, msg: 'success' };
  }

  @Post('verifyotp')
  public async verifyOTP(@Body() body: VerifyOTPDTO, @Res() res: Response) {
    const { access_token, refresh_token } = await this.AuthService.verify_otp(
      body.otp,
      body.email,
    );

    res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_COOKIE_TTL,
    });

    res.status(200).json({
      data: {
        access_token,
      },
    });

    // return { data: 'jwt' };
  }

  @Post('google')
  public async google_auth(@Cookies(REFRESH_TOKEN_COOKIE) name: string) {
    console.log(name);

    return 'okay';
  }

  @Post('login')
  public async login() {
    return await this.AuthService.login();
    // return 'OKAY_LETS_BEGIN';
  }

  @Post('forgot_password')
  public async forgot_password() {}

  @Post('reset_password')
  public async reset_password() {}

  @Post('refresh_token')
  public async refresh_token() {}
}
