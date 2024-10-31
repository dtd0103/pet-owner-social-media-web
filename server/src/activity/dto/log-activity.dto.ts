import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export class LogActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  actionType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum([
    'post',
    'group',
    'like',
    'comment',
    'relationship',
    'report',
    'pet',
    'user',
    'message',
  ])
  objectType:
    | 'post'
    | 'group'
    | 'like'
    | 'comment'
    | 'relationship'
    | 'report'
    | 'pet'
    | 'user'
    | 'message';

  @ApiProperty()
  @IsNotEmpty()
  details: string;
}
