import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { User } from 'src/user/entities/user.entity';
import { LogActivityDto } from './dto/log-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async logActivity(user: User, logActivityDto: LogActivityDto) {
    const newActivity = new Activity();
    newActivity.actionType = logActivityDto.actionType;
    newActivity.objectId = logActivityDto.objectId;
    newActivity.objectType = logActivityDto.objectType;
    newActivity.details = logActivityDto.details;
    newActivity.timestamp = new Date();
    newActivity.user = user;

    await this.activityRepository.save(newActivity);
  }
}
