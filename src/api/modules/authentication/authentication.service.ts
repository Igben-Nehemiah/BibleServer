import { isInstance } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { HttpException } from '../../common/errors/custom-error';
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

interface CookieUser {
  cookie: string;
  user: User;
}

type ExtendedCookieUser = CookieUser &
    { isTwoFactorAuthenticationEnabled: boolean };

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

      const newUser = await this.authRepository.add({
        ...createUserDto,
        password: hashedPassword,
      });

      delete newUser.password;
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

    if (user === null) return new Result<ExtendedCookieUser>(new WrongCredentialsException());

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password!);

    if (!isPasswordMatching) return new Result<ExtendedCookieUser>(new WrongCredentialsException());

    delete user.password;
    delete user.twoFactorAuthenticationCode;
    const tokenData = this.createToken(user);

    return  new Result<ExtendedCookieUser>({
      cookie: this.createCookie(tokenData),
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled ?? false,
      user: user,
    })
  }

  private createToken(user: User, isSecondFactorAuthenticated = false): TokenData {
    const expiresIn = 3600; // TODO: Read from environment
    // const algorithm = process.env.JWT_ALGORITHM!
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

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  getTwoFactorAuthenticationCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  }

  async respondWithQRCode(data: string, response: Response) {
    await QRCode.toFileStream(response, data);
  }

  generateTwoFactorAuthenticationCode = async (user: User) => {
    const { otpauthUrl, base32 } = this.getTwoFactorAuthenticationCode();

    if (user._id === undefined) throw new Error('User Id cannot be undefined');
    await this.authRepository.findByIdAndUpdate(user._id, {
      twoFactorAuthenticationCode: base32,
    });
    return otpauthUrl;
  };

  public verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode: string, user: User) {
    if (user.twoFactorAuthenticationCode === undefined) throw new Error("Two factor authentication not set for this user")
    return speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationCode,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
    });
  }

  turnOnTwoFactorAuthentication = async (user: User, twoFactorAuthenticationCode: string) => {
    if (user === undefined) throw new Error("User not logged in");

    const isCodeValid = this.verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode, user,
    );

    if (user._id === undefined) throw new Error("User not logged in"); //TODO: Correct errors

    if (isCodeValid) {
      await this.authRepository.findByIdAndUpdate(user._id, {
        isTwoFactorAuthenticationEnabled: true,
      });
      return new Result<number>(200);
    } else {
      return new Result<number>(new WrongAuthenticationTokenException());
    }
  }

  secondFactorAuthentication = async (user: User, twoFactorAuthenticationCode: string) => {
    
    const isCodeValid = await this.verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode, user,
    );
    if (isCodeValid) {
      const tokenData = this.createToken(user, true);

      delete user.password;
      delete user.twoFactorAuthenticationCode;
      return new Result<CookieUser>(
        {cookie: this.createCookie(tokenData), 
          user
        });
    } else {
      return new Result<CookieUser>(new WrongAuthenticationTokenException());
    }
  }
}

export default AuthenticationService;
