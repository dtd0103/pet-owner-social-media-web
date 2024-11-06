import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { ListCommentDto } from './dto/list-comment.dto';
import { Media } from 'src/media/entities/media.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';
import { ActivityService } from 'src/activity/activity.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @Inject(ActivityService) private readonly activityService: ActivityService,
  ) {}

  async findAll(filterQuery: ListCommentDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);
    console.log(searchTerm);
    const [comments, totalComments] = await this.commentRepository.findAndCount(
      {
        where: {
          text: Like(`%${searchTerm}%`),
          user: {
            name: Like(`%${searchTerm}%`),
          },
        },
        skip: skip,
        order: { updatedAt: 'DESC' },
        relations: ['user', 'post'],
        select: {
          user: {
            id: true,
          },
          post: {
            id: true,
          },
          text: true,
          repliedComment: {
            id: true,
          },
          createdAt: true,
        },
      },
    );
    const totalPage = Math.ceil(totalComments / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: comments,
      totalComments,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async getByPostId(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updatedAt: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment', 'media'],
      where: {
        post: {
          id: postId,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        media: {
          id: true,
          link: true,
          type: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          },
          createdAt: true,
        },
      },
    });
  }

  async getByUserId(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updatedAt: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment'],
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          },
          createdAt: true,
        },
      },
    });
  }

  async getById(id: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updatedAt: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment', 'media'],
      where: {
        id: id,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            name: true,
            avatar: true,
          },
          createdAt: true,
        },
      },
    });
  }

  async create(
    userId: string,
    createCommentDto: CreateCommentDto,
    file?: Express.Multer.File,
  ): Promise<Comment> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
      relations: ['comments'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const comment = new Comment();
    comment.text = createCommentDto.text;
    comment.user = user;
    comment.post = post;

    if (createCommentDto.repliedCommentId) {
      const repliedComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.repliedCommentId },
      });
      if (repliedComment) {
        comment.repliedComment = repliedComment;
      } else {
        throw new HttpException(
          'Replied comment not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    try {
      const savedComment = await this.commentRepository.save(comment);

      if (file) {
        const media = new Media();
        const type = file.mimetype.split('/')[0];

        if (type === 'image') {
          media.type = 'image';
        } else if (type === 'video') {
          media.type = 'video';
        }

        const uploadDir = path.join(__dirname, '../../../uploads/comment');
        const filePath = path.join(
          uploadDir,
          `${Date.now()}_${file.originalname}`,
        );

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, file.buffer);
        media.link = filePath;
        media.comment = savedComment;

        await this.mediaRepository.save(media);
        savedComment.media = media;
      }

      const logActivityDto: LogActivityDto = {
        actionType: 'create',
        objectId: savedComment.id,
        objectType: 'comment',
        details: `User ${user.name} commented on a post.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return this.commentRepository.findOne({
        where: { id: savedComment.id },
        relations: ['user', 'post', 'media', 'repliedComment', 'replies'],
        select: {
          user: {
            id: true,
            name: true,
            avatar: true,
          },
          post: {
            id: true,
          },
          media: {
            id: true,
            link: true,
            type: true,
          },
          repliedComment: {
            id: true,
          },
          replies: {
            id: true,
            text: true,
            createdAt: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error occurred while creating comment: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
    file?: Express.Multer.File,
  ): Promise<Comment> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'media'],
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.user.id !== userId) {
      throw new HttpException(
        'You do not have permission to update this comment',
        HttpStatus.FORBIDDEN,
      );
    }

    comment.text = updateCommentDto.text;

    try {
      if (file) {
        const media = new Media();
        const type = file.mimetype.split('/')[0];

        if (type === 'image') {
          media.type = 'image';
        } else if (type === 'video') {
          media.type = 'video';
        }

        const uploadDir = path.join(__dirname, '../../../uploads/comment');
        const filePath = path.join(
          uploadDir,
          `${Date.now()}_${file.originalname}`,
        );

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, file.buffer);
        media.link = filePath;
        media.comment = comment;

        const existingMedia = await this.mediaRepository.findOne({
          where: { comment: comment },
        });
        if (existingMedia) {
          await this.mediaRepository.delete(existingMedia.id);
        }
        await this.mediaRepository.save(media);
        comment.media = media;
      }

      const savedComment = await this.commentRepository.save(comment);

      const logActivityDto: LogActivityDto = {
        actionType: 'update',
        objectId: savedComment.id,
        objectType: 'comment',
        details: `User ${user.name} updated a comment.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return this.commentRepository.findOne({
        where: { id: savedComment.id },
        relations: ['user', 'post', 'media'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
          post: {
            id: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error occurred while updating comment: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.delete(id);
    const logActivityDto: LogActivityDto = {
      actionType: 'delete',
      objectId: id,
      objectType: 'comment',
      details: `User ${user.name} deleted a comment.`,
    };
    await this.activityService.logActivity(user, logActivityDto);
  }
}
