import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreateMessageDto {
  @ApiProperty()
  groupId?: string;

  @ApiProperty()
  receiverId?: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  media?: Media;
}
