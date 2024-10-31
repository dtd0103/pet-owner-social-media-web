import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class UpdateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  media: Media;
}
