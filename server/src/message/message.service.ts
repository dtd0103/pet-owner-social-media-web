import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/user/entities/user.entity';
import { ActivityService } from '../activity/activity.service';
import { LogActivityDto } from '../activity/dto/log-activity.dto';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(ActivityService) private readonly activityService: ActivityService,
  ) {}

  async findAll() {
    return await this.messageRepository.find({
      order: { sendAt: 'DESC' },
      relations: ['sender', 'receiver', 'group'],
      select: {
        id: true,
        content: true,
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        sendAt: true,
      },
    });
  }

  async getClient(id: string) {
    return await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
      select: {
        sender: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'group'],
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });
  }

  async findAllBySender(sender_id: string) {
    return await this.messageRepository.find({
      order: { sendAt: 'DESC' },
      relations: ['sender', 'receiver', 'group'],
      where: {
        sender: {
          id: sender_id,
        },
      },
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });
  }

  async findAllByReceiver(receiver_id: string) {
    return await this.messageRepository.find({
      order: { sendAt: 'DESC' },
      relations: ['sender', 'receiver', 'group'],
      where: {
        receiver: {
          id: receiver_id,
        },
      },
      select: {
        id: true,
        content: true,
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        sendAt: true,
      },
    });
  }

  async findMyMessagesTo(id: any, receiver_id: string) {
    return await this.messageRepository.find({
      order: { sendAt: 'DESC' },
      relations: ['sender', 'receiver'],
      where: {
        sender: {
          id: id,
        },
        receiver: {
          id: receiver_id,
        },
      },
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });
  }

  async getUserConversation(
    current_id: string,
    user_id: string,
  ): Promise<Message[]> {
    return await this.messageRepository.find({
      order: { sendAt: 'ASC' },
      relations: ['sender', 'receiver'],
      where: [
        { sender: { id: current_id }, receiver: { id: user_id } },
        { sender: { id: user_id }, receiver: { id: current_id } },
      ],
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async getAllUserConversation(id: any): Promise<Message[]> {
    const userGroups = await this.groupRepository.find({
      where: { users: { id: id } },
      relations: ['users'],
    });
    const groupConversations = await this.messageRepository.find({
      where: userGroups.map((group) => ({
        group: { id: group.id },
      })),
      order: { sendAt: 'DESC' },
      relations: ['sender', 'group', 'receiver'],
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });

    const userConversations = await this.messageRepository.find({
      where: [
        { sender: { id: id }, group: IsNull() },
        { receiver: { id: id }, group: IsNull() },
      ],
      order: { sendAt: 'DESC' },
      relations: ['sender', 'receiver', 'group'],
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });

    const filteredUserConversations = userConversations.filter((message) => {
      const index = userConversations.findIndex(
        (item) =>
          (item.sender.id == message.sender.id &&
            item.receiver?.id == message.receiver?.id) ||
          (item.sender.id == message.receiver?.id &&
            item.receiver?.id == message.sender.id),
      );
      return userConversations.indexOf(message) == index;
    });
    const filteredGroupConversations = groupConversations.filter((message) => {
      const index = groupConversations.findIndex(
        (item) => item.group.id == message.group.id,
      );
      return groupConversations.indexOf(message) == index;
    });

    const conversations = [
      ...filteredUserConversations,
      ...filteredGroupConversations,
    ];

    return conversations;
  }

  async getGroupConversation(id: any, group_id: string): Promise<Message[]> {
    const isUserInGroup = await this.groupRepository.findOne({
      where: { id: group_id, users: { id: id } },
    });
    if (!isUserInGroup) {
      throw new Error('User not in group');
    }

    return await this.messageRepository.find({
      order: { sendAt: 'ASC' },
      relations: ['sender', 'group'],
      where: { group: { id: group_id } },
      select: {
        sender: {
          id: true,
          name: true,
          avatar: true,
        },
        content: true,
        sendAt: true,
      },
    });
  }

  async create(
    senderId: string,
    createMessageDto: CreateMessageDto,
    file?: Express.Multer.File,
  ): Promise<Message> {
    const sender = await this.userRepository.findOneBy({ id: senderId });
    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }

    const message = new Message();
    message.content = createMessageDto.content;
    message.sender = sender;

    if (createMessageDto.receiverId) {
      const receiver = await this.userRepository.findOneBy({
        id: createMessageDto.receiverId,
      });
      if (receiver) {
        message.receiver = receiver;
      } else {
        throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
      }
    }

    if (createMessageDto.groupId) {
      const group = await this.groupRepository.findOneBy({
        id: createMessageDto.groupId,
      });
      if (group) {
        message.group = group;
      } else {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
    }

    try {
      if (file) {
        const media = new Media();
        const type = file.mimetype.split('/')[0];

        if (type === 'image' || type === 'video') {
          media.type = type;
          media.link = await this.saveMediaFile(file);
          message.media = media;
          await this.mediaRepository.save(media);
        }
      }

      const savedMessage = await this.messageRepository.save(message);
      await this.logMessageActivity(sender, savedMessage);

      return this.messageRepository.findOne({
        where: { id: savedMessage.id },
        relations: ['sender', 'receiver', 'group', 'media'],
      });
    } catch (error) {
      throw new HttpException(
        'Error occurred while sending message: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }

  private async saveMediaFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, '../../../uploads/message');
    const filePath = path.join(uploadDir, `${Date.now()}_${file.originalname}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
  }

  private async logMessageActivity(user: User, message: Message) {
    const logActivityDto: LogActivityDto = {
      actionType: 'send',
      objectId: message.id,
      objectType: 'message',
      details: `User ${user.name} sent a message.`,
    };

    await this.activityService.logActivity(user, logActivityDto);
  }
}
