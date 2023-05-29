import { isInstance } from "class-validator";
import CreateUserDto from "./dtos/create-user.dto";
import * as bcrypt from "bcrypt";
import LoginDto from "./dtos/login.dto";
import { HttpException } from "../../common/errors/custom-error";
import { DataStoredInToken, TokenData } from "./interfaces/token-data";
import * as jwt from "jsonwebtoken";
import { throwIfNullOrUndefined } from "../../common/guards";
import * as speakeasy from "speakeasy";
import * as QRCode from 'qrcode';
import { Response } from "express";
import { IAuthenticationRepository, User } from "./interfaces";
import { Result } from "@nehemy/result-monad";
import { UserWithEmailAlreadyExistsException, WrongCredentialsException } from "./exceptions";

type CookieUser = {
    cookie: string;
    user: User;
};

class AuthenticationService {
    constructor(private readonly authRepository: IAuthenticationRepository) {};

    public async registerUser(createUserDto: CreateUserDto) 
        : Promise<Result<CookieUser>> {
        try {
            throwIfNullOrUndefined(createUserDto.email);
            throwIfNullOrUndefined(createUserDto.password);

            const existingUser = await this.authRepository.findUserByEmail(createUserDto.email!);

            if (existingUser) throw new UserWithEmailAlreadyExistsException(createUserDto.email!);

            const hashedPassword = await bcrypt.hash(createUserDto.password!, parseInt(process.env.SALT_ROUNDS!));

            const newUser = await this.authRepository.add({
                ...createUserDto,
                password: hashedPassword
            });

            delete newUser.password;
            const tokenData = this.createToken(newUser);
            return new Result({
                cookie: this.createCookie(tokenData),
                user: newUser
            });
            
        }catch(e: unknown){
            return isInstance(e, Error) ? new Result<CookieUser>(e as Error) 
                : new Result<CookieUser>(new Error("User registration failed"));
        };
    };

    public async login(loginDto: LoginDto) 
        : Promise<Result<CookieUser>> {
        try {

            throwIfNullOrUndefined(loginDto.email);
            throwIfNullOrUndefined(loginDto.password);
    
            const user = await this.authRepository.findUserByEmail(loginDto.email!);
    
            if (!user) throw new WrongCredentialsException();
    
            const isPasswordMatching = await bcrypt.compare(loginDto.password!, user.password!);

            if (!isPasswordMatching) throw new WrongCredentialsException();

            
            delete user.password;
            
            const tokenData = this.createToken(user);
            this.createCookie(tokenData)
            return new Result({
                cookie: this.createCookie(tokenData),
                user
            });
        }catch(e: unknown){
            return isInstance(e, Error) || isInstance(e, HttpException) 
                ? new Result<CookieUser>((e as Error)) 
                : new Result<CookieUser>(new Error("User login failed"));
        };
    };
    
    private createToken(user: User): TokenData{
        const expiresIn = 3600; // TODO: Read from environment
        const algorithm = process.env.JWT_ALGORITHM!;
        const secret = process.env.JWT_SECRET!;

        const dataStoredInToken: DataStoredInToken = {
            _id: user._id
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {
                expiresIn,

            })
        };
    }

    public createCookie(tokenData: TokenData) : string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    };

    getTwoFactorAuthenticationCode() {
        const secretCode = speakeasy.generateSecret({
            name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
          });
          return {
            otpauthUrl : secretCode.otpauth_url,
            base32: secretCode.base32,
          };
    };

    respondWithQRCode(data: string, response: Response) {
        QRCode.toFileStream(response, data);
    };

    generateTwoFactorAuthenticationCode = async (user: User) => {
        const {
          otpauthUrl,
          base32,
        } = this.getTwoFactorAuthenticationCode();
        await this.authRepository.findByIdAndUpdate(user._id!, {
          twoFactorAuthenticationCode: base32,
        });
        return otpauthUrl;
      };
}

export default AuthenticationService;