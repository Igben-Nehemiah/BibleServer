import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class LoginDto {
    @IsEmail()
    @IsString()
    public email?: string;

    @IsString()
    public password?: string;
}

export default LoginDto;