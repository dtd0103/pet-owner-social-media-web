import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Message } from './entities/message.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, Media, Group, Activity]),
    ConfigModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, ActivityService],
  exports: [MessageService],
})
export class MessageModule {}
