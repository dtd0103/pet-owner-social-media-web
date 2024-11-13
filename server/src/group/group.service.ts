import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

import { ListGroupDto } from './dto/list-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { ActivityService } from 'src/activity/activity.service';

import * as fs from 'fs';
import * as path from 'path';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(ActivityService) private readonly activityService: ActivityService,
  ) {}

  async getAll() {
    const groups = await this.groupRepository.find();

    if (!groups.length) {
      throw new HttpException('No groups found', HttpStatus.NOT_FOUND);
    }

    return groups;
  }

  async findAll(filterQuery: ListGroupDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);

    const results = await this.groupRepository
      .createQueryBuilder('g')
      .leftJoin('user_group', 'ug', 'ug.GROUP_ID = g.id')
      .leftJoin('user', 'u', 'u.id = ug.USER_ID')
      .where('g.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .select([
        'g.id AS groupId',
        'g.name AS groupName',
        'g.avatar AS groupAvatar',
        'u.id AS userId',
        'u.name AS userName',
        'u.avatar AS userAvatar',
        'ug.role AS role',
        'ug.joined_at AS joinedAt',
      ])
      .orderBy('g.id', 'DESC')
      .skip(skip)
      .take(itemsPerPage)
      .getRawMany();

    const groupsMap = new Map();

    results.forEach((row) => {
      const {
        groupId,
        groupName,
        groupAvatar,
        userId,
        userName,
        userAvatar,
        role,
        joinedAt,
      } = row;

      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, {
          id: groupId,
          name: groupName,
          avatar: groupAvatar,
          users: [],
        });
      }

      const group = groupsMap.get(groupId);
      if (userId && userName) {
        group.users.push({
          id: userId,
          name: userName,
          avatar: userAvatar,
          role: role,
          joinedAt: joinedAt,
        });
      }
    });

    const groups = Array.from(groupsMap.values());
    const totalGroups = groups.length; // Tổng số nhóm
    const totalPage = Math.ceil(totalGroups / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: groups,
      totalGroups,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  // async getById(id: string): Promise<Group> {
  //   const group = await this.groupRepository.findOne({
  //     where: { id },
  //     relations: ['users'],
  //     select: {
  //       id: true,
  //       name: true,
  //       avatar: true,
  //       users: {
  //         id: true,
  //         name: true,
  //         avatar: true,
  //       },
  //     },
  //   });

  //   if (!group) {
  //     throw new HttpException('Group not found.', HttpStatus.NOT_FOUND);
  //   }

  //   return group; // Trả về đối tượng nhóm đã tìm thấy
  // }
  async getById(id: string): Promise<Group> {
    const results = await this.groupRepository
      .createQueryBuilder('g')
      .leftJoin('user_group', 'ug', 'ug.GROUP_ID = g.id')
      .leftJoin('user', 'u', 'u.id = ug.USER_ID')
      .where('g.id = :id', { id })
      .select([
        'g.id AS groupId',
        'g.name AS groupName',
        'g.avatar AS groupAvatar',
        'u.id AS userId',
        'u.name AS userName',
        'u.avatar AS userAvatar',
        'ug.role AS role',
        'ug.joined_at AS joinedAt',
      ])
      .getRawMany();

    if (!results.length) {
      throw new HttpException('Group not found.', HttpStatus.NOT_FOUND);
    }

    const groupData = {
      id: results[0].groupId,
      name: results[0].groupName,
      avatar: results[0].groupAvatar,
      users: [],
    };

    results.forEach((row) => {
      if (row.userId && row.userName) {
        groupData.users.push({
          id: row.userId,
          name: row.userName,
          avatar: row.userAvatar,
          role: row.role,
          joinedAt: row.joinedAt,
        });
      }
    });

    return groupData;
  }

  async getByUserId(id: string): Promise<any[]> {
    const userGroups = await this.groupRepository
      .createQueryBuilder('g')
      .leftJoin('user_group', 'ug', 'ug.GROUP_ID = g.id')
      .where('ug.USER_ID = :id', { id })
      .select([
        'g.id AS groupId',
        'g.name AS groupName',
        'g.avatar AS groupAvatar',
        'ug.role AS role',
        'ug.joined_at AS joinedAt',
      ])
      .getRawMany();

    if (!userGroups.length) {
      throw new HttpException(
        'No groups found for this user.',
        HttpStatus.NOT_FOUND,
      );
    }

    return userGroups.map((group) => ({
      id: group.groupId,
      name: group.groupName,
      avatar: group.groupAvatar,
      role: group.role,
      joinedAt: group.joinedAt,
    }));
  }

  async create(
    userId: string,
    createGroupDto: CreateGroupDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const group = await this.groupRepository.save({
      name: createGroupDto.name,
      users: [user],
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (file) {
      try {
        const groupAvatarPath = await this.saveFile(file, '/avatars/group');
        group.avatar = groupAvatarPath;
        await this.groupRepository.save(group);
      } catch (error) {
        throw new BadRequestException(
          'Failed to upload group avatar: ' + error,
        );
      }
    }

    const existingUserGroup = await this.groupRepository
      .createQueryBuilder('g')
      .relation(Group, 'users')
      .of(group.id)
      .loadMany();

    if (
      !existingUserGroup.some((existingUser) => existingUser.id === user.id)
    ) {
      await this.groupRepository
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(group)
        .add(user);
    }

    await this.groupRepository.query(
      `INSERT INTO user_group (GROUP_ID, USER_ID, role) VALUES (?, ?, 'Admin') ON DUPLICATE KEY UPDATE role = 'Admin'`,
      [group.id, user.id],
    );

    const logActivityDto: LogActivityDto = {
      actionType: 'create',
      objectId: group.id,
      objectType: 'group',
      details: `User ${user.name} created a group.`,
    };

    await this.activityService.logActivity(user, logActivityDto);

    return this.groupRepository.find({
      where: { id: group.id },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        users: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async update(
    userId: string,
    groupId: string,
    updateGroupDto: UpdateGroupDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const userGroupRelation = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('user_group', 'userGroup', 'userGroup.group_id = group.id')
      .select('userGroup.role')
      .where('userGroup.user_id = :userId', { userId })
      .andWhere('userGroup.group_id = :groupId', { groupId })
      .getRawOne();

    if (!userGroupRelation) {
      throw new HttpException(
        'User is not part of this group.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userGroupRelation.role !== 'Admin') {
      throw new HttpException(
        'User is not authorized to update this group.',
        HttpStatus.FORBIDDEN,
      );
    }

    group.name = updateGroupDto.name || group.name;

    if (file) {
      try {
        const groupAvatarPath = await this.saveFile(file, '/avatars/group');
        group.avatar = groupAvatarPath;
      } catch (error) {
        throw new BadRequestException(
          'Failed to upload group avatar: ' + error,
        );
      }
    }

    await this.groupRepository.save(group);

    if (updateGroupDto.userIds) {
      const existingUsers = group.users.map((u) => u.id);

      for (const userId of updateGroupDto.userIds) {
        if (!existingUsers.includes(userId)) {
          const userToAdd = await this.userRepository.findOne({
            where: { id: userId },
          });
          if (userToAdd) {
            group.users.push(userToAdd);
          }
        }
      }

      await this.groupRepository.save(group);
    }

    const logActivityDto: LogActivityDto = {
      actionType: 'update',
      objectId: group.id,
      objectType: 'group',
      details: `User ${user.name} updated the group.`,
    };

    await this.activityService.logActivity(user, logActivityDto);

    return this.groupRepository.find({
      where: { id: group.id },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        avatar: true,
        users: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async join(userId: string, id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['groups'],
      });
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      if (!user || !group) {
        throw new HttpException(
          'User or group not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isUserPartOfGroup = group.users.some((user) => user.id === userId);
      if (isUserPartOfGroup) {
        throw new HttpException(
          'User is already part of the group',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.groupRepository
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(id)
        .add(userId);

      const logActivityDto: LogActivityDto = {
        actionType: 'join',
        objectId: group.id,
        objectType: 'group',
        details: `User ${user.name} join the group.`,
      };

      await this.activityService.logActivity(user, logActivityDto);

      return this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
        select: {
          id: true,
          name: true,
          users: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Can not join group', HttpStatus.BAD_REQUEST);
    }
  }

  async leave(userId: string, id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['groups'],
      });
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      if (!user || !group) {
        throw new HttpException(
          'User or group not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isUserPartOfGroup = group.users.some((user) => user.id === userId);
      if (!isUserPartOfGroup) {
        throw new HttpException(
          'User is not part of the group',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.groupRepository
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(id)
        .remove(userId);

      const logActivityDto: LogActivityDto = {
        actionType: 'leave',
        objectId: group.id,
        objectType: 'group',
        details: `User ${user.name} leave the group.`,
      };

      await this.activityService.logActivity(user, logActivityDto);

      return this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
        select: {
          id: true,
          name: true,
          users: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Can not leave group', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(userId: string, groupId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const userGroupRelation = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('user_group', 'userGroup', 'userGroup.group_id = group.id')
      .select('userGroup.role')
      .where('userGroup.user_id = :userId', { userId })
      .andWhere('userGroup.group_id = :groupId', { groupId })
      .getRawOne();

    if (!userGroupRelation) {
      throw new HttpException(
        'User is not part of this group.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userGroupRelation.role !== 'Admin') {
      throw new HttpException(
        'User is not authorized to delete this group.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.groupRepository.delete(groupId);

    const logActivityDto: LogActivityDto = {
      actionType: 'delete',
      objectId: group.id,
      objectType: 'group',
      details: `User ${user.name} deleted the group.`,
    };

    await this.activityService.logActivity(user, logActivityDto);
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
}
