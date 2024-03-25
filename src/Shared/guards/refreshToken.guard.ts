import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN, REFRESH_TOKEN_COOKIE } from '../../Helpers/Config';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_COOKIE) {}
