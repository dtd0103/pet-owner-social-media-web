import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  postId: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  media?: Media;

  @ApiProperty()
  repliedCommentId?: string;
}
