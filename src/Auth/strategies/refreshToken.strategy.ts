import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_SECRET } from '../../Helpers/Config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_COOKIE) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies[REFRESH_TOKEN_COOKIE];
        },
      ]),
      secretOrKey: REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refresh_token = req.cookies[REFRESH_TOKEN_COOKIE];
    return {
      ...payload,
      refresh_token,
    };
  }
}
