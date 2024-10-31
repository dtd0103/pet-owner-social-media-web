import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Media, Group, Activity]),
    ConfigModule,
    ActivityModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
