import { isInstance } from "class-validator";
import throwIfNullOrUndefined from "../../common/guards/null-and-undefined.guard";
import CreateUserDto from "./dtos/create-user.dto";
import UserWithEmailAlreadyExistsException from "./exceptions/user-with-email-already-exists.exception";
import User from "./interfaces/user.interface";
import * as bcrypt from "bcrypt";
import LoginDto from "./dtos/login.dto";
import WrongCredentialsException from "./exceptions/wrong-credentials.exception";
import { HttpException } from "../../common/errors/custom-error";
import { DataStoredInToken, TokenData } from "./interfaces/token-data";
import * as jwt from "jsonwebtoken";
import IAuthenticationRepository from "./interfaces/authentication-repository.interface";
import { Result } from "@nehemy/result-monad";

type CookieUser = {
    cookie: string;
    user: User;
}

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
}

export default AuthenticationService;