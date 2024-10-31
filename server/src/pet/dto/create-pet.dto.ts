import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  species: string;

  @ApiProperty()
  @IsNotEmpty()
  sex: boolean;

  @ApiProperty()
  @IsNotEmpty()
  breed: string;

  @ApiProperty()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  avatar: string;
}
