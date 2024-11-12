import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(filterQuery: ListUserDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);
    const [users, totalUsers] = await this.userRepository.findAndCount({
      where: [
        { name: Like(`%${searchTerm}%`) },
        { email: `%${searchTerm}%` },
        { tel: `%${searchTerm}%` },
      ],
      take: itemsPerPage,
      skip: skip,
      select: [
        'id',
        'name',
        'email',
        'tel',
        'avatar',
        'status',
        'createAt',
        'updateAt',
      ],
    });

    const totalPage = Math.ceil(totalUsers / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: users,
      totalUsers,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        role: true,
        avatar: true,
        background: true,
        quote: true,
        status: true,
        createAt: true,
        updateAt: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.delete(id);
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const avatarPath = await this.saveFile(file, 'avatars');
    user.avatar = avatarPath;

    return this.userRepository.save(user);
  }

  async updateBackground(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const backgroundPath = await this.saveFile(file, 'backgrounds');
    user.background = backgroundPath;

    return this.userRepository.save(user);
  }

  private async saveFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const uploadDir = path.join(__dirname, '../../../uploads', folder);
    const filePath = path.join(uploadDir, `${Date.now()}_${file.originalname}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
