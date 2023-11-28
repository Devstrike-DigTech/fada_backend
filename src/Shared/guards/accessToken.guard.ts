import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN } from '../../Helpers/Config';

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN) {}
