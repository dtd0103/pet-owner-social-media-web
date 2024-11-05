import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityController } from './activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
