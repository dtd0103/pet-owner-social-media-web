import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'database/data.provider';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Comment } from './comment/entities/comment.entity';
import { Media } from './media/entities/media.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { Group } from './group/entities/group.entity';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { GroupModule } from './group/group.module';
import { RelationshipModule } from './relationship/relationship.module';
import { Relationship } from './relationship/entities/relationship.entity';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { ActivityModule } from './activity/activity.module';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      User,
      Comment,
      Media,
      Post,
      Group,
      Relationship,
      Message,
    ]),

    UserModule,
    AuthModule,
    PostModule,
    PetModule,
    GroupModule,
    RelationshipModule,
    CommentModule,
    ReportModule,
    ActivityModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
