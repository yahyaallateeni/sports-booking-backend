import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum AccountTypeEnum {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export class RegisterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(AccountTypeEnum)
  accountType!: AccountTypeEnum;
}
