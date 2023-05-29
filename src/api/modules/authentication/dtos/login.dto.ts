import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  public email!: string;

  @IsString()
  public password!: string;
}