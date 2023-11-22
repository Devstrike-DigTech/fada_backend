import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from 'src/User/user.repository';
import { RegisterDTO } from './dto';
import Phone from 'src/Helpers/lib/phone.lib';
import { EncryptDecrypt } from 'src/Helpers/lib/encrypt_decrypt';
import { OTPGenerator } from 'src/Helpers/lib/otpGenerator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TTL,
  OTP_TTL,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TTL,
} from 'src/Helpers/Config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IToken } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly JwtService: JwtService,
  ) {}

  public async register(user: RegisterDTO) {
    const formatted_phone_or_unverified_user =
      await this.validate_registering_user(user.email, user.phone);

    if (typeof formatted_phone_or_unverified_user != 'string')
      return formatted_phone_or_unverified_user;

    //hash password
    const password = await EncryptDecrypt.encrypt(user.password);

    //store user in db
    await this.UserRepository.create(
      {},
      { ...user, password, phone: formatted_phone_or_unverified_user },
    );

    //generate otp
    const otp = OTPGenerator.generate();

    //Store user otp to redis or cache
    await this.cacheManager.set(user.email, await EncryptDecrypt.encrypt(otp), {
      ttl: OTP_TTL,
    });

    //Send user otp
    console.log(otp);
    const hashed = await this.cacheManager.get(user.email);

    return 'OTP sent to email';
  }

  public async login() {
    //check if email exist
    //verify password
    //generate jwt
  }

  public async forgot_password() {}

  public async reset_password() {}

  public async verify_otp(otp: string, email: string): Promise<IToken> {
    const hashedOtp = await this.cacheManager.get(email);
    console.log(hashedOtp);

    if (!hashedOtp) throw new ForbiddenException('expired OTP');

    const isValidOtp = await EncryptDecrypt.decrypt(hashedOtp as string, otp);

    if (!isValidOtp) throw new ForbiddenException('invalid OTP');

    //get user from db
    const user = await this.UserRepository.findOne(
      { email },
      { email: 1, id: 1, role: 1 },
    );

    if (!user) throw new ForbiddenException('Access Denied');

    //generate jwt and sign user in
    const tokens = await this.generateAuthTokens(
      user.id,
      user.email,
      user.role,
    );

    // update user profile to verified, status to active and new refresh Token
    await this.UserRepository.findOneAndUpdate(
      {
        is_verified: true,
        active: true,
        refresh_token: [await EncryptDecrypt.encrypt(tokens.refresh_token)],
      },
      { email },
      { email: 1, id: 1, role: 1 },
    );

    //send Welcome Email

    return tokens;
  }

  private async validate_registering_user(
    email: string,
    phone: string,
  ): Promise<string | { email: string; msg: string }> {
    //check if phone is valid?
    const formatted_phone = Phone.format_validate(phone);
    if (!formatted_phone) throw new BadRequestException('Phone not valid');

    //check if email exist
    const existingUser = await this.UserRepository.isEmailExist(email);

    if (existingUser && existingUser.email && !existingUser.is_verified)
      return {
        email: existingUser.email,
        msg: 'verify your account to continue',
      };

    if (existingUser && existingUser.email)
      throw new BadRequestException('Email already Exist');

    if (await this.UserRepository.isPhone(formatted_phone))
      throw new BadRequestException('Phone already Exist');

    return formatted_phone;
  }

  private async generateAuthTokens(
    id: string,
    email: string,
    role: string,
  ): Promise<IToken> {
    const payload = {
      id,
      email,
      role,
    };
    return {
      access_token: await this.signToken(
        payload,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_TTL,
      ),
      refresh_token: await this.signToken(
        payload,
        REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_TTL,
      ),
    };
  }

  private async signToken(payload: JwtPayload, secret: string, ttl: string) {
    return await this.JwtService.signAsync(payload, { secret, expiresIn: ttl });
  }
}
