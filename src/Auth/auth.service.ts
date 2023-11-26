import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
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
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IToken } from './types';
import { AuthMgtRepository } from '../User/authMgt.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly AuthMgtRepository: AuthMgtRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly JwtService: JwtService,
  ) {}

  public async register(user: RegisterDTO) {
    const formatted_phone_or_unverified_user = await this.validate_registering_user(user.email, user.phone);

    if (typeof formatted_phone_or_unverified_user != 'string') return formatted_phone_or_unverified_user;

    //hash password
    const password = await EncryptDecrypt.encrypt(user.password);

    //store user in db
    await this.UserRepository.create(
      {},
      { ...user, password, fada_id: this.generateRandomFadaId(), phone: formatted_phone_or_unverified_user },
    );

    //generate otp
    const otp = OTPGenerator.generate();

    //Store user otp to redis or cache
    await this.cacheManager.set(user.email, await EncryptDecrypt.encrypt(otp), {
      ttl: OTP_TTL,
    });

    //Todo Send user otp to email
    console.log(otp);
    // const hashed = await this.cacheManager.get(user.email);

    return 'OTP sent to email';
  }

  public async forgot_password(email: string) {
    //1) check if user email exist
    const user = await this.UserRepository.isEmailExist(email);

    if (!user) throw new NotFoundException();

    //2) generate otp
    const otp = OTPGenerator.generate();
    //3) hash otp
    await this.cacheManager.set(user.email, await EncryptDecrypt.encrypt(otp), {
      ttl: OTP_TTL,
    });

    //3) send otp to email
    console.log(otp);

    return 'otp sent to your email';
  }

  public async reset_password(password: string, email: string, otp: string, user_ip, user_agent) {
    //check if user email exist
    const user = await this.UserRepository.isEmailExist(email);

    if (!user) throw new NotFoundException();

    //get otp from cache using email
    const hashedOtp = await this.cacheManager.get(email);

    //throw error if email doesnt exist
    if (!hashedOtp) throw new ForbiddenException('expired otp');

    //throw error if otp are same
    if (!(await EncryptDecrypt.decrypt(hashedOtp as string, otp))) throw new ForbiddenException('invalid otp');

    await this.cacheManager.del(email);

    //hash new password
    const hashedPassword = await EncryptDecrypt.encrypt(password);

    //update password hash
    const updatedUser = await this.UserRepository.findOneAndUpdate(
      { password: hashedPassword },
      { email: user.email },
      { id: 1 },
    );

    if (!updatedUser) throw new ForbiddenException('something went wrong');
    //login user automatically

    return this.login(email, password, user_ip, user_agent);
  }

  public async verify_otp(otp: string, email: string, user_agent: string, user_ip: string): Promise<IToken> {
    const hashedOtp = await this.cacheManager.get(email);

    if (!hashedOtp) throw new ForbiddenException('expired OTP');

    const isValidOtp = await EncryptDecrypt.decrypt(hashedOtp as string, otp);

    if (!isValidOtp) throw new ForbiddenException('invalid OTP');

    await this.cacheManager.del(email);

    //get user from db
    const user = await this.UserRepository.findOne({ email }, { email: 1, id: 1, role: 1 });

    if (!user) throw new ForbiddenException('Access Denied');

    //generate jwt and sign user in
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

    // update user profile to verified, status to active and new refresh Token
    await this.UserRepository.findOneAndUpdate(
      {
        is_verified: true,
        active: true,
      },
      { email },
      { email: 1, id: 1, role: 1 },
    );

    await this.AuthMgtRepository.create(
      { _id: 1 },
      {
        user_id: user.id,
        user_agent,
        refresh_token: await EncryptDecrypt.encrypt(tokens.refresh_token),
        ip: user_ip,
        last_login: new Date().toISOString(),
      },
    );
    //send Welcome Email

    return tokens;
  }

  /**
   *
   * @param unique_identifier
   * @param password
   * @param refresh_token
   * @param user_ip
   * @param user_agent
   */
  public async login(
    unique_identifier: string,
    password: string,
    user_ip: string,
    user_agent: string,
    refresh_token: string = '',
  ): Promise<IToken> {
    const user = await this.UserRepository.findOneFromUniqueIdentifiers([
      {
        email: unique_identifier,
      },
      {
        fada_id: unique_identifier,
      },
      {
        phone: unique_identifier,
      },
    ]);
    if (!user) throw new BadRequestException('Email or password is invalid');
    //verify password
    if (!(await EncryptDecrypt.decrypt(user.password, password)))
      throw new BadRequestException('Email or password is invalid');
    //generate tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);
    //add newly generated token to the refresh token array
    //remove refresh token if exist
    const saved_refresh_tokens = await this.AuthMgtRepository.findMany(
      {
        user_id: user.id,
      },
      { id: 1, refresh_token: 1 },
    );
    console.log(saved_refresh_tokens);
    console.log(tokens, 'okay');
    if (saved_refresh_tokens.length > 0) {
      const here = await this.findOldToken(saved_refresh_tokens, refresh_token);
      await this.AuthMgtRepository.findOneAndUpdate(
        {
          user_id: user.id,
          user_agent,
          refresh_token: await EncryptDecrypt.encrypt(tokens.refresh_token),
          ip: user_ip,
          last_login: new Date().toISOString(),
        },
        { _id: here },
        {},
        { new: true, upsert: true },
      );
    } else {
      await this.AuthMgtRepository.create(
        {},
        {
          user_id: user.id,
          user_agent,
          refresh_token: await EncryptDecrypt.encrypt(tokens.refresh_token),
          ip: user_ip,
          last_login: new Date().toISOString(),
        },
      );
    }
    return tokens;
  }

  public async authWithGoogle() {
    //Todo Sign in with google
  }

  public async refreshToken(refresh_token: string) {
    //Todo refresh token functionality
    const foundToken = await this.AuthMgtRepository.findOne({ refresh_token }, {});

    if (!foundToken) {
      const decodedUser = await this.JwtService.verify(refresh_token, { secret: REFRESH_TOKEN_SECRET });
      if (decodedUser instanceof JsonWebTokenError) throw new ForbiddenException();

      await this.AuthMgtRepository.model.deleteMany({ user_id: decodedUser.id });
    }
  }

  public async logout(refresh_token: string, onAllDevices: boolean = false) {
    //Todo Logout functionality
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

    if (existingUser && existingUser.email) throw new BadRequestException('Email already Exist');

    if (await this.UserRepository.isPhone(formatted_phone)) throw new BadRequestException('Phone already Exist');

    return formatted_phone;
  }

  private async generateAuthTokens(id: string, email: string, role: string): Promise<IToken> {
    const payload = {
      id,
      email,
      role,
    };
    return {
      access_token: await this.signToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_TTL),
      refresh_token: await this.signToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_TTL),
    };
  }

  private async signToken(payload: JwtPayload, secret: string, ttl: string) {
    return await this.JwtService.signAsync(payload, { secret, expiresIn: ttl });
  }

  private async findOldToken(
    saved_tokens: { _id: string; refresh_token: string }[],
    old_token: string,
  ): Promise<string> {
    const doc = saved_tokens.find(async (el: { _id: string; refresh_token: string }) => {
      return await EncryptDecrypt.decrypt(el.refresh_token, old_token);
    });

    if (!doc) return null;

    return doc._id;
  }

  private generateRandomFadaId() {
    // Generate a random number from 0 to 9
    const randomNumber = Math.floor(Math.random() * 10);

    // Convert the number to a 10-character string with leading zeros if necessary
    const randomString = randomNumber.toString().padStart(10, '0');

    return randomString;
  }
}
