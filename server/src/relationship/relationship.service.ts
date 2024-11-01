import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activityService: ActivityService,
  ) {}

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async findRelationship(
    userId: string,
    friendId: string,
  ): Promise<Relationship> {
    return this.relationshipRepository.findOne({
      where: {
        user: { id: userId },
        friend: { id: friendId },
      },
    });
  }

  async getAll(): Promise<Relationship[]> {
    const relationships = await this.relationshipRepository.find({
      relations: ['user', 'friend'],
      select: {
        user: { id: true, name: true, avatar: true },
        friend: { id: true, name: true, avatar: true },
        status: true,
        isFriend: true,
        isBlocked: true,
      },
    });

    if (!relationships.length) {
      throw new HttpException('Relationships not found', HttpStatus.NOT_FOUND);
    }

    return relationships;
  }

  async getByUserId(id: string): Promise<Relationship[]> {
    const userRelationships = await this.relationshipRepository.find({
      where: { user: { id } },
      relations: ['user', 'friend'],
      select: {
        user: { id: true, name: true, avatar: true },
        friend: { id: true, name: true, avatar: true },
        status: true,
        isFriend: true,
        isBlocked: true,
      },
    });

    if (!userRelationships.length) {
      throw new HttpException('Relationships not found', HttpStatus.NOT_FOUND);
    }

    return userRelationships;
  }

  async getFriends(id: string): Promise<Relationship[]> {
    const friends = await this.relationshipRepository.find({
      where: [
        { user: { id }, isFriend: true },
        { friend: { id }, isFriend: true },
      ],
      relations: ['user', 'friend'],
    });

    if (!friends.length) {
      throw new HttpException('No friends found', HttpStatus.NOT_FOUND);
    }

    return friends;
  }

  async getById(id: string): Promise<Relationship> {
    const relationship = await this.relationshipRepository.findOne({
      where: { id },
      select: {
        user: { id: true, name: true, avatar: true },
        friend: { id: true, name: true, avatar: true },
        status: true,
        isFriend: true,
        isBlocked: true,
      },
    });

    if (!relationship) {
      throw new HttpException('Relationship not found', HttpStatus.NOT_FOUND);
    }

    return relationship;
  }

  async getRecommended(userId: string): Promise<Relationship[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friends = user.friendships.map((friend) => friend.id);
    const relationships = await this.relationshipRepository.find({
      where: {
        user: { id: Not(In(friends)) },
        friend: { id: Not(userId) },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
        },
        friend: {
          id: true,
          name: true,
          avatar: true,
        },
        status: true,
        isFriend: true,
        isBlocked: true,
      },
    });
    return relationships;
  }

  async getPendingRequests(userId: string): Promise<Relationship[]> {
    const pendingRequests = await this.relationshipRepository.find({
      where: [
        { user: { id: userId }, status: 'pending' },
        { friend: { id: userId }, status: 'pending' },
      ],
      relations: ['user', 'friend'],
      select: {
        user: { id: true, name: true, avatar: true },
        friend: { id: true, name: true, avatar: true },
        status: true,
        isFriend: true,
        isBlocked: true,
      },
    });

    if (!pendingRequests.length) {
      throw new HttpException(
        'No pending requests found',
        HttpStatus.NOT_FOUND,
      );
    }

    return pendingRequests;
  }

  async sendRequest(userId: string, friendId: string) {
    const existingRelationship = await this.findRelationship(userId, friendId);
    if (existingRelationship) {
      throw new HttpException(
        'Friend request already sent',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userId === friendId) {
      throw new HttpException(
        'You cannot send a friend request to yourself.',
        HttpStatus.FORBIDDEN,
      );
    }

    const relationship = this.relationshipRepository.create({
      user: { id: userId },
      friend: { id: friendId },
      status: 'pending',
    });
    await this.relationshipRepository.save(relationship);

    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);

    const logActivityDto: LogActivityDto = {
      actionType: 'send_request',
      objectId: friend.id,
      objectType: 'relationship',
      details: `User ${user.name} sent a friend request to ${friend.name}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return { message: 'Friend request sent' };
  }

  async acceptRequest(userId: string, friendId: string) {
    const relationship = await this.findRelationship(friendId, userId);
    if (!relationship || relationship.status !== 'pending') {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }

    relationship.status = 'accepted';
    relationship.isFriend = true;
    await this.relationshipRepository.save(relationship);

    const reverseRelationship = await this.findRelationship(userId, friendId);
    if (reverseRelationship) {
      reverseRelationship.status = 'accepted';
      reverseRelationship.isFriend = true;
      await this.relationshipRepository.save(reverseRelationship);
    }

    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);

    const logActivityDto: LogActivityDto = {
      actionType: 'accept_request',
      objectId: friend.id,
      objectType: 'relationship',
      details: `User ${user.name} accepted friend request from ${friend.name}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return { message: 'Friend request accepted' };
  }

  async rejectRequest(userId: string, friendId: string) {
    const relationship = await this.findRelationship(friendId, userId);
    if (relationship?.status === 'pending') {
      await this.relationshipRepository.remove(relationship);

      const reverseRelationship = await this.findRelationship(userId, friendId);
      if (reverseRelationship) {
        await this.relationshipRepository.remove(reverseRelationship);
      }

      const user = await this.findUserById(userId);
      const friend = await this.findUserById(friendId);

      const logActivityDto: LogActivityDto = {
        actionType: 'reject_request',
        objectId: friend.id,
        objectType: 'relationship',
        details: `User ${user.name} rejected friend request from ${friend.name}.`,
      };
      await this.activityService.logActivity(user, logActivityDto);
      return { message: 'Friend request rejected' };
    }
    throw new HttpException(
      'Invalid request rejection',
      HttpStatus.BAD_REQUEST,
    );
  }

  async cancelRequest(userId: string, friendId: string) {
    const relationship = await this.findRelationship(userId, friendId);

    if (relationship?.status === 'pending') {
      await this.relationshipRepository.remove(relationship);

      const reverseRelationship = await this.findRelationship(friendId, userId);
      if (reverseRelationship) {
        await this.relationshipRepository.remove(reverseRelationship);
      }

      const user = await this.findUserById(userId);
      const friend = await this.findUserById(friendId);

      const logActivityDto: LogActivityDto = {
        actionType: 'cancel_request',
        objectId: friend.id,
        objectType: 'relationship',
        details: `User ${user.name} canceled friend request to ${friend.name}.`,
      };
      await this.activityService.logActivity(user, logActivityDto);
      return { message: 'Friend request canceled' };
    }
    throw new HttpException(
      'Invalid request cancellation',
      HttpStatus.BAD_REQUEST,
    );
  }

  async blockFriend(userId: string, friendId: string) {
    const relationship = await this.findRelationship(userId, friendId);
    if (!relationship) {
      throw new HttpException('Relationship not found', HttpStatus.NOT_FOUND);
    }

    if (!relationship.isFriend) {
      throw new HttpException('User are not friend', HttpStatus.FORBIDDEN);
    }

    relationship.isBlocked = true;
    await this.relationshipRepository.save(relationship);

    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);

    const logActivityDto: LogActivityDto = {
      actionType: 'block',
      objectId: friend.id,
      objectType: 'relationship',
      details: `User ${user.name} blocked ${friend.name}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return { message: 'Friend blocked' };
  }

  async unblockFriend(userId: string, friendId: string) {
    const relationship = await this.findRelationship(userId, friendId);
    if (!relationship || !relationship.isBlocked) {
      throw new HttpException('Friend not blocked', HttpStatus.NOT_FOUND);
    }

    relationship.isBlocked = false;
    await this.relationshipRepository.save(relationship);

    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);

    const logActivityDto: LogActivityDto = {
      actionType: 'unblock',
      objectId: friend.id,
      objectType: 'relationship',
      details: `User ${user.name} unblocked ${friend.name}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return { message: 'Friend unblocked' };
  }

  async removeFriend(userId: string, friendId: string) {
    const relationship = await this.findRelationship(userId, friendId);
    if (!relationship || !relationship.isFriend) {
      throw new HttpException('User are not friend', HttpStatus.NOT_FOUND);
    }

    await this.relationshipRepository.remove(relationship);

    const reverseRelationship = await this.findRelationship(friendId, userId);
    if (reverseRelationship) {
      await this.relationshipRepository.remove(reverseRelationship);
    }

    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);

    const logActivityDto: LogActivityDto = {
      actionType: 'remove_friend',
      objectId: friend.id,
      objectType: 'relationship',
      details: `User ${user.name} removed ${friend.name} from friends.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return { message: 'Friend removed' };
  }
}
