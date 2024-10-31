import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from 'src/activity/activity.module';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, Activity]),
    ConfigModule,
    ActivityModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
