import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  status: 'Under Review' | 'Resolved' | 'Rejected';
}
