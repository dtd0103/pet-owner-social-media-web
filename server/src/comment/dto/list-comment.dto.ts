import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';

export class ListCommentDto {
  @ApiProperty()
  @IsOptional()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  itemsPerPage?: number;
}
