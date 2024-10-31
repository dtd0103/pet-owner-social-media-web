import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  tel: string;

  @ApiProperty({ enum: ['Pet Owner', 'Admin'] })
  @IsOptional()
  role?: 'Pet Owner' | 'Admin';
}
