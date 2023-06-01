import { isInstance } from 'class-validator';
import * as bcrypt from 'bcrypt';
import {
  type DataStoredInToken,
  type TokenData,
} from './interfaces/token-data';
import * as jwt from 'jsonwebtoken';
import { throwIfNullOrUndefined } from '../../common/guards';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { type Response } from 'express';
import { type IAuthenticationRepository, type User } from './interfaces';
import { Result } from '@nehemy/result-monad';
import {
  UserWithEmailAlreadyExistsException,
  WrongAuthenticationTokenException,
  WrongCredentialsException,
} from './exceptions';
import { CreateUserDto, LoginDto } from './dtos';
import { HttpException } from '../../common/errors/custom-error';

interface CookieUser {
  cookie: string;
  user: User;
}

type ExtendedCookieUser = CookieUser & {
  isTwoFactorAuthenticationEnabled: boolean;
};

class AuthenticationService {
  constructor(private readonly authRepository: IAuthenticationRepository) {}

  public async registerUser(
    createUserDto: CreateUserDto
  ): Promise<Result<CookieUser>> {
    try {
      throwIfNullOrUndefined(createUserDto.email);
      throwIfNullOrUndefined(createUserDto.password);

      const existingUser = await this.authRepository.findUserByEmail(
        createUserDto.email
      );

      if (existingUser != null)
        throw new UserWithEmailAlreadyExistsException(createUserDto.email);

      const saltRounds = process.env.SALT_ROUNDS;

      if (saltRounds === undefined) throw new Error('Salt rounds not defined');
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        parseInt(saltRounds)
      );

      const newUser: User = await this.authRepository.add({
        ...createUserDto,
        password: hashedPassword,
      });

      this.removeSensitiveUserInfo(newUser);

      const tokenData = this.createToken(newUser);

      return new Result({
        cookie: this.createCookie(tokenData),
        user: newUser,
      });
    } catch (e: unknown) {
      return isInstance(e, Error)
        ? new Result<CookieUser>(e as Error)
        : new Result<CookieUser>(new Error('User registration failed'));
    }
  }

  login = async (loginDto: LoginDto): Promise<Result<ExtendedCookieUser>> => {
    const user = await this.authRepository.findUserByEmail(loginDto.email);

    if (user === null)
      return new Result<ExtendedCookieUser>(new WrongCredentialsException());

    if (user.password === undefined)
      throw new Error('User password is undefined');

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordMatching)
      return new Result<ExtendedCookieUser>(new WrongCredentialsException());

    this.removeSensitiveUserInfo(user);

    const tokenData = this.createToken(user);

    return new Result<ExtendedCookieUser>({
      cookie: this.createCookie(tokenData),
      isTwoFactorAuthenticationEnabled:
        user.isTwoFactorAuthenticationEnabled ?? false,
      user: user,
    });
  };

  public generateTwoFactorAuthenticationCode = async (user: User) => {
    const { otpauthUrl, base32 } = this.getTwoFactorAuthenticationCode();

    if (user._id === undefined)
      throw new HttpException('User Id cannot be undefined', 400);

    await this.authRepository.findByIdAndUpdate(user._id, {
      twoFactorAuthenticationCode: base32,
    });
    return otpauthUrl;
  };

  public async respondWithQRCode(data: string, response: Response) {
    await QRCode.toFileStream(response, data);
  }

  public turnOnTwoFactorAuthentication = async (
    user: User,
    twoFactorAuthenticationCode: string
  ) => {
    if (user === undefined) throw new HttpException('User not logged in', 401);

    const isCodeValid = this.verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode,
      user
    );

    if (user._id === undefined)
      throw new HttpException('User not logged in', 401); //TODO: Correct errors

    if (isCodeValid) {
      await this.authRepository.findByIdAndUpdate(user._id, {
        isTwoFactorAuthenticationEnabled: true,
      });
      return new Result<number>(200);
    } else {
      return new Result<number>(new WrongAuthenticationTokenException());
    }
  };

  public secondFactorAuthenticate = async (
    user: User,
    twoFactorAuthenticationCode: string
  ) => {
    const isCodeValid = this.verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode,
      user
    );
    if (isCodeValid) {
      const tokenData = this.createToken(user, true);

      this.removeSensitiveUserInfo(user);

      return new Result<CookieUser>({
        cookie: this.createCookie(tokenData),
        user,
      });
    } else {
      return new Result<CookieUser>(new WrongAuthenticationTokenException());
    }
  };

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private verifyTwoFactorAuthenticationCode(
    twoFactorAuthenticationCode: string,
    user: User
  ) {
    if (user.twoFactorAuthenticationCode === undefined) {
      throw new HttpException('User authentication code cannot be empty', 401);
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationCode,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
      step: 60,
      window: 1,
    });
  }

  private createToken(
    user: User,
    isSecondFactorAuthenticated = false
  ): TokenData {
    if (process.env.JWT_EXPIRATION_IN_SECONDS === undefined)
      throw new Error('JWT expiration time not defined');

    const expiresIn = parseInt(process.env.JWT_EXPIRATION_IN_SECONDS);
    const secret = process.env.JWT_SECRET;

    if (secret === undefined) throw new Error('No token secret provided');

    if (user._id === undefined) throw new Error('User id cannot be empty');

    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      isSecondFactorAuthenticated,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {
        expiresIn,
      }),
    };
  }

  private removeSensitiveUserInfo(user: User) {
    user.password = undefined;
    user.twoFactorAuthenticationCode = undefined;
  }

  private getTwoFactorAuthenticationCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });

    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }
}

export default AuthenticationService;
