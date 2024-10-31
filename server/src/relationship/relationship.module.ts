import { Module } from '@nestjs/common';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Relationship, Activity]),
    ConfigModule,
    ActivityModule,
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
