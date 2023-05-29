import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  public password!: string;
}

export default CreateUserDto;
