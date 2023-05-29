import { IsString } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsString()
  public twoFactorAuthenticationCode!: string;
}