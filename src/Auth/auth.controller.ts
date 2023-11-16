import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  public async signup(@Body() body: RegisterDTO) {
    const user = await this.AuthService.register(body);

    return { data: user, msg: 'success' };
  }

  @Post('google')
  public async google_auth() {}

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
