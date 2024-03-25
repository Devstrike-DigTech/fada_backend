import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, VerifyOTPDTO } from './dto';
import { Cookies } from 'src/Helpers/decorators/cookies.decorator';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_TTL } from '../Helpers/Config';
import { ResetPasswordDTO } from './dto/resetPassword.dto';
import { AccessTokenGuard, RefreshTokenGuard } from '../Shared/guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  public async signup(@Body() body: RegisterDTO) {
    const user = await this.AuthService.register(body);

    return { data: user, msg: 'success' };
  }

  @Post('verify_otp')
  public async verifyOTP(@Body() body: VerifyOTPDTO, @Res() res: Response, @Req() req: Request) {
    const { access_token, refresh_token } = await this.AuthService.verify_otp(
      body.otp,
      body.email,
      req.header('user-agent'),
      req.ip,
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
  }

  @Post('google')
  public async google_auth(@Cookies(REFRESH_TOKEN_COOKIE) name: string) {
    console.log(name);

    return 'okay';
  }

  @Post('login')
  public async login(
    @Body() body: LoginDTO,
    @Res() res: Response,
    @Req() req: Request,
    @Cookies(REFRESH_TOKEN_COOKIE) refresh_token_cookie: string,
  ) {
    const { access_token, refresh_token } = await this.AuthService.login(
      body.username,
      body.password,
      req.ip,
      req.header('user-agent'),
      refresh_token_cookie,
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
  }

  @Post('forgot_password')
  public async forgot_password(@Body('email') email: string) {
    return await this.AuthService.forgot_password(email);
  }

  @Post('reset_password')
  public async reset_password(@Body() body: ResetPasswordDTO, @Res() res: Response, @Req() req: Request) {
    const { access_token, refresh_token } = await this.AuthService.reset_password(
      body.password,
      body.email,
      body.otp,
      req.ip,
      req.header('user-agent'),
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
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh_token')
  public async refresh_token(@Req() req: Request, @Res() res: Response) {
    const { access_token, refresh_token } = await this.AuthService.refreshToken(
      req.user['id'],
      req.user['refresh_token'],
      req.header('user-agent'),
      req.ip,
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
  }
  @UseGuards(AccessTokenGuard)
  @Get('route')
  public async protectedRoute(@Req() req: Request) {
    console.log(req.user);
    return 'yea';
  }

  @Get('logout')
  public async logout() {
    await this.AuthService.logout('lsf');
    return 'okay';
  }
}
