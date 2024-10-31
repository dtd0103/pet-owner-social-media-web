import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @ValidateIf((o) => !o.tel)
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  @IsOptional()
  tel?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
