import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Pet } from './entities/pet.entity';
import { Like, Repository } from 'typeorm';
import { ListPetDto } from './dto/list-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,

    @Inject(ActivityService) private readonly activityService: ActivityService,
  ) {}

  async findAll(filterQuery: ListPetDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);
    const [pets, totalPets] = await this.petRepository.findAndCount({
      order: { id: 'DESC' },
      relations: ['owner'],
      where: [
        {
          name: Like(`%${searchTerm}%`),
        },
        {
          species: Like(`%${searchTerm}%`),
        },
        {
          breed: Like(`%${searchTerm}%`),
        },
        {
          description: Like(`%${searchTerm}%`),
        },
      ],
      take: itemsPerPage,
      skip: skip,
      select: {
        owner: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
    const totalPage = Math.ceil(totalPets / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: pets,
      totalPets,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({ where: { id } });

    if (!pet) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }
    return pet;
  }

  async getByUserId(id: string) {
    const pets = await this.petRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id: id,
        },
      },
    });

    if (!pets) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }

    return pets;
  }

  async create(
    userId: string,
    createPetDto: CreatePetDto,
    file: Express.Multer.File,
  ): Promise<Pet> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const pet = new Pet();
    pet.name = createPetDto.name;
    pet.species = createPetDto.species;
    pet.date = new Date(createPetDto.date);
    pet.breed = createPetDto.breed;
    pet.sex = createPetDto.sex;
    pet.description = createPetDto.description;
    pet.owner = user;

    try {
      const savedPet = await this.petRepository.save(pet);

      if (file) {
        const uploadDir = path.join(__dirname, '../../../uploads/avatars/pet');

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(
          uploadDir,
          `${Date.now()}_${file.originalname}`,
        );
        fs.writeFileSync(filePath, file.buffer);

        pet.avatar = filePath;
      }

      await this.petRepository.save(pet);

      const logActivityDto: LogActivityDto = {
        actionType: 'create',
        objectId: pet.id,
        objectType: 'pet',
        details: `User ${user.name} created a pet profile.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return this.petRepository.findOne({
        where: { id: savedPet.id },
        relations: ['owner'],
        select: {
          owner: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error occurred while creating pet: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    userId: string,
    petId: string,
    createPetDto: CreatePetDto,
    file: Express.Multer.File,
  ): Promise<Pet | string> {
    const pet = await this.petRepository.findOne({
      where: {
        id: petId,
        owner: { id: userId },
      },
      relations: ['owner'],
    });

    if (!pet) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }

    pet.name = createPetDto.name;
    pet.species = createPetDto.species;
    pet.date = new Date(createPetDto.date);
    pet.breed = createPetDto.breed;
    pet.sex = createPetDto.sex;
    pet.description = createPetDto.description;

    if (file) {
      const uploadDir = path.join(__dirname, '../../../uploads/avatars/pet');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(
        uploadDir,
        `${Date.now()}_${file.originalname}`,
      );
      fs.writeFileSync(filePath, file.buffer);

      pet.avatar = filePath;
    }

    await this.petRepository.save(pet);

    const logActivityDto: LogActivityDto = {
      actionType: 'update',
      objectId: pet.id,
      objectType: 'pet',
      details: `User ${pet.owner.name} updated a pet profile.`,
    };
    await this.activityService.logActivity(pet.owner, logActivityDto);

    return this.petRepository.findOne({
      where: { id: petId },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async remove(userId: string, id: string): Promise<string> {
    const pet = await this.petRepository.findOne({
      where: {
        id,
        owner: { id: userId },
      },
      relations: ['owner'],
    });

    if (!pet) {
      throw new HttpException(
        'Pet not found or you are not the owner of this pet',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.petRepository.delete({ id });

    const logActivityDto: LogActivityDto = {
      actionType: 'delete',
      objectId: pet.id,
      objectType: 'pet',
      details: `User ${pet.owner.name} delete a pet profile.`,
    };
    await this.activityService.logActivity(pet.owner, logActivityDto);

    return 'Pet has been successfully removed';
  }
}
