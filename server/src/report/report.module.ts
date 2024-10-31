import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Report } from './entities/report.entity';
import { ActivityModule } from 'src/activity/activity.module';
import { Activity } from 'src/activity/entities/activity.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Comment } from 'src/comment/entities/comment.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, Activity, Report]),
    ConfigModule,
    ActivityModule,
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
