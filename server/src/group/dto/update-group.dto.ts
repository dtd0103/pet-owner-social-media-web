import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  userIds: string[];
}
