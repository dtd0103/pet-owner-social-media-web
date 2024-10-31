import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, User, Activity]),
    ConfigModule,
    ActivityModule,
  ],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
