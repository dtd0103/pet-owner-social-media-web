import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  media?: Media;

  @ApiProperty()
  groupId?: string;
}
