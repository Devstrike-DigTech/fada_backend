import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/User/user.repository';
import { RegisterDTO } from './dto';
import Phone from 'src/Helpers/lib/phone.lib';
import { Cryptography } from 'src/Helpers/lib/cryptography';
import { OTPGenerator } from 'src/Helpers/lib/otpGenerator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TTL,
  OTP_TTL,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TTL,
  ROLE,
} from 'src/Helpers/Config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IToken } from './types';
import { AuthMgtRepository } from '../User/authMgt.repository';
import { EmailService } from '../mail/mail.service';
import { PcnService } from '../Externals/Pcn.service';

interface IRef {
  _id: string;
  refresh_token: string;
  iv: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly AuthMgtRepository: AuthMgtRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly JwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly pcnService: PcnService,
  ) {}

  public async register(user: RegisterDTO) {
    const formatted_phone_or_unverified_user = await this.validate_registering_user(user.email, user.phone);

    if (typeof formatted_phone_or_unverified_user != 'string') return formatted_phone_or_unverified_user;

    //check if user is pharmacist
    if (user.role == ROLE.PHARMACIST) {
      if (!user.pcn) throw new BadRequestException('please provide pharmacist pcn');
      //check if pcn exist
      const pharm = await this.pcnService.verify(user.pcn);

      if (pharm.FirstName !== user.first_name) throw new BadRequestException('You are an intruder!');
    }

    //hash password
    const password = await Cryptography.hash(user.password);

    //store user in db
    await this.UserRepository.create(
      {},
      { ...user, password, fada_id: this.generateRandomFadaId(), phone: formatted_phone_or_unverified_user },
    );

    //generate otp
    const otp = OTPGenerator.generate();

    //Store user otp to redis or cache
    await this.cacheManager.set(user.email, await Cryptography.hash(otp), {
      ttl: OTP_TTL,
    });

    await this.emailService.sendOtp({ email: user.email, otp, name: user.last_name });
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
    await this.cacheManager.set(user.email, await Cryptography.hash(otp), {
      ttl: OTP_TTL,
    });

    //3) send otp to email
    await this.emailService.sendOtp({ email: user.email, otp, name: user.last_name });

    return 'otp sent to your email';
  }

  public async reset_password(password: string, email: string, otp: string, user_ip: string, user_agent: string) {
    //check if user email exist
    const user = await this.UserRepository.isEmailExist(email);

    if (!user) throw new NotFoundException();

    //get otp from cache using email
    const hashedOtp = await this.cacheManager.get(email);

    //throw error if email doesnt exist
    if (!hashedOtp) throw new ForbiddenException('expired otp');

    //throw error if otp are same
    if (!(await Cryptography.verify(hashedOtp as string, otp))) throw new ForbiddenException('invalid otp');

    await this.cacheManager.del(email);

    //hash new password
    const hashedPassword = await Cryptography.hash(password);

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

    const isValidOtp = await Cryptography.verify(hashedOtp as string, otp);

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

    const encryptedData = Cryptography.encrypt(tokens.refresh_token);
    await this.AuthMgtRepository.create(
      { _id: 1 },
      {
        user_id: user.id,
        user_agent,
        refresh_token: encryptedData.encryptedText,
        iv: encryptedData.initializationVector,
        ip: user_ip,
        last_login: new Date().toISOString(),
      },
    );
    //send Welcome Email
    this.emailService.welcomeEmail({ email: user.email, name: user.last_name });
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
    if (!(await Cryptography.verify(user.password, password)))
      throw new BadRequestException('Email or password is invalid');
    //generate tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);
    //add newly generated token to the refresh token array
    //remove refresh token if exist
    const saved_refresh_tokens = await this.AuthMgtRepository.findMany(
      {
        user_id: user.id,
      },
      { id: 1, refresh_token: 1, iv: 1 },
    );
    if (saved_refresh_tokens.length > 0) {
      const here = await this.findOldToken(saved_refresh_tokens, refresh_token);
      const encryptedData = Cryptography.encrypt(tokens.refresh_token);
      await this.AuthMgtRepository.findOneAndUpdate(
        {
          user_id: user.id,
          user_agent,
          refresh_token: encryptedData.encryptedText,
          iv: encryptedData.initializationVector,
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
          refresh_token: Cryptography.encrypt(tokens.refresh_token),
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

  public async refreshToken(user_id: string, refresh_token: string, user_agent: string, user_ip: string) {
    const userRefreshTokens = await this.AuthMgtRepository.findMany(
      { user_id },
      { user_id: 1, id: 1, refresh_token: 1, iv: 1 },
    );

    if (!userRefreshTokens && userRefreshTokens.length <= 0) throw new UnauthorizedException();
    const foundToken = userRefreshTokens.find(async (el: IRef) => {
      const decryptedText = Cryptography.decrypt(el.refresh_token, el.iv);
      return decryptedText == refresh_token;
    });

    //1) Find item where refresh token matches
    if (!foundToken) {
      const decodedUser = await this.JwtService.verify(refresh_token, { secret: REFRESH_TOKEN_SECRET });
      if (decodedUser instanceof JsonWebTokenError) throw new ForbiddenException();

      await this.AuthMgtRepository.model.deleteMany({ user_id: decodedUser.id });
    }

    //2) verify refresh token
    const ExpiredOrInvalidToken = await this.JwtService.verify(refresh_token, { secret: REFRESH_TOKEN_SECRET });

    //3) if token is expired clear refresh_token  from db
    if (ExpiredOrInvalidToken instanceof TokenExpiredError) {
      await this.AuthMgtRepository.findOneAndDelete({ _id: foundToken._id });
    }

    //4) if token is invalid or expired
    if (ExpiredOrInvalidToken instanceof JsonWebTokenError || ExpiredOrInvalidToken.id != foundToken.user_id) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateAuthTokens(
      ExpiredOrInvalidToken.id,
      ExpiredOrInvalidToken.email,
      ExpiredOrInvalidToken.role,
    );

    //replace refresh token in db
    const encryptedData = Cryptography.encrypt(refresh_token);
    await this.AuthMgtRepository.findOneAndUpdate(
      {
        refresh_token: encryptedData.encryptedText,
        iv: encryptedData.initializationVector,
        user_agent,
        ip: user_ip,
      },
      { _id: foundToken._id },
    );

    return tokens;
  }

  public async logout(refresh_token: string, onAllDevices: boolean = false) {
    //Todo Logout functionality
    // await this.emailService.welcomeEmail({ email: 'uzoagulujoshua@gmail.com', name: 'Sally Nwamama' });
    await this.emailService.sendOtp({ email: 'uzoagulujoshua@gmail.com', name: 'Sally Nwamama', otp: '879723' });
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

  private async findOldToken(saved_tokens: IRef[], old_token: string): Promise<string> {
    const doc = saved_tokens.find(async (el: IRef) => {
      const decryptedText = Cryptography.decrypt(el.refresh_token, el.iv);
      return decryptedText == old_token;
    });

    if (!doc) return null;

    return doc._id;
  }

  private generateRandomFadaId() {
    // Generate a random number from 0 to 9
    const randomNumber = Math.floor(Math.random() * 10);

    // Convert the number to a 10-character string with leading zeros if necessary
    return randomNumber.toString().padStart(10, '0');
  }
}
