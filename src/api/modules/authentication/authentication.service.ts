import { isInstance } from "class-validator";
import Result from "../../common/Results/base.result";
import FailureResult from "../../common/Results/failure.result";
import SuccessResult from "../../common/Results/success.result";
import throwIfNullOrUndefined from "../../common/guards/null-and-undefined.guard";
import CreateUserDto from "./dtos/create-user.dto";
import UserWithEmailAlreadyExistsException from "./exceptions/user-with-email-already-exists.exception";
import User from "./interfaces/user.interface";
import AuthenticationRepository from "./repositories/authentication.repository";
import * as bcrypt from "bcrypt";
import LoginDto from "./dtos/login.dto";
import WrongCredentialsException from "./exceptions/wrong-credentials.exception";
import { HttpException } from "../../common/errors/custom-error";


class AuthenticationService {
    constructor(private readonly authRepository: AuthenticationRepository) {};

    public async registerUser(createUserDto: CreateUserDto) : Promise<Result<User>> {
        try {
            throwIfNullOrUndefined(createUserDto.email);
            throwIfNullOrUndefined(createUserDto.password);

            const existingUser = await this.authRepository.findUserByEmail(createUserDto.email!);

            if (existingUser) throw new UserWithEmailAlreadyExistsException(createUserDto.email!);

            const hashedPassword = await bcrypt.hash(createUserDto.password!, 5);

            const newUser = await this.authRepository.add({
                ...createUserDto,
                password: hashedPassword
            });

            delete newUser.password;
            return new SuccessResult(newUser);
            
        }catch(e: unknown){
            return isInstance(e, Error) ? new FailureResult([(e as Error).message]) 
                : new FailureResult(["User registration failed"]);
        }
    };

    public async login(loginDto: LoginDto) : Promise<Result<User>> {
        try {

            throwIfNullOrUndefined(loginDto.email);
            throwIfNullOrUndefined(loginDto.password);
    
            const user = await this.authRepository.findUserByEmail(loginDto.email!);
    
            if (!user) throw new WrongCredentialsException();
    
            const isPasswordMatching = await bcrypt.compare(loginDto.password!, user.password!);

            if (!isPasswordMatching) throw new WrongCredentialsException();

            delete user.password;

            return new SuccessResult(user);
        }catch(e: unknown){
            return isInstance(e, Error) || isInstance(e, HttpException) ? new FailureResult([(e as Error).message]) 
                : new FailureResult(["User login failed"]);
        }
    }
}

export default AuthenticationService;