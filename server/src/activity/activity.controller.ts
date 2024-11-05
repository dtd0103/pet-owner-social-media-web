import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@ApiTags('Activity')
@Controller('api/v1/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @UseGuards(AuthGuard)
  @Get('user')
  async findAll(@Req() req: any) {
    return this.activityService.getByUserId(req.user.id);
  }
}
