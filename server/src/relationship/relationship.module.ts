import { Module } from '@nestjs/common';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityModule } from 'src/activity/activity.module';
import { Message } from 'src/message/entities/message.entity';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Relationship, Activity, Message]),
    ConfigModule,
    ActivityModule,
    MessageModule,
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
