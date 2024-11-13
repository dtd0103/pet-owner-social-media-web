import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ActivityService } from 'src/activity/activity.service';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostDto } from './dto/list-post.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @Inject(ActivityService) private readonly activityService: ActivityService,
  ) {}

  async getAll() {
    const posts = await this.postRepository.find();

    if (!posts.length) {
      throw new HttpException('No posts found', HttpStatus.NOT_FOUND);
    }

    return posts;
  }

  async create(
    userId: string,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.user = user;
    console.log(createPostDto);
    if (createPostDto.groupId) {
      const group = await this.groupRepository.findOne({
        where: { id: createPostDto.groupId },
      });
      if (group) {
        post.group = group;
      } else {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
    }

    try {
      const savedPost = await this.postRepository.save(post);

      if (file) {
        const media = new Media();
        const type = file.mimetype.split('/')[0];

        if (type == 'image') {
          media.type = 'image';
        } else if (type == 'video') {
          media.type = 'video';
        }

        const uploadDir = path.join(__dirname, '../../../uploads/post');
        const filePath = path.join(
          uploadDir,
          `${Date.now()}_${file.originalname}`,
        );

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, file.buffer);

        media.link = filePath;
        media.post = savedPost;

        await this.mediaRepository.save(media);
        savedPost.media = media;
      }

      const logActivityDto: LogActivityDto = {
        actionType: 'create',
        objectId: savedPost.id,
        objectType: 'post',
        details: `User ${user.name} created a post.`,
      };

      await this.activityService.logActivity(user, logActivityDto);
      return this.postRepository.findOne({
        where: { id: savedPost.id },
        relations: ['user', 'comments', 'media'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            tel: true,
            avatar: true,
          },
          comments: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error occur while creating post: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async update(
  //   id: string,
  //   userId: string,
  //   updatePostDto: UpdatePostDto,
  //   file?: Express.Multer.File,
  // ): Promise<Post> {
  //   const user = await this.userRepository.findOneBy({ id: userId });
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const post = await this.postRepository.findOne({
  //     where: { id },
  //     relations: ['user', 'media'],
  //     select: {
  //       user: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         avatar: true,
  //       },
  //     },
  //   });

  //   if (!post) {
  //     throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  //   }

  //   if (post.user.id !== userId) {
  //     throw new HttpException(
  //       'You do not have permission to update this post',
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }

  //   post.title = updatePostDto.title;
  //   post.description = updatePostDto.description;

  //   try {
  //     if (file) {
  //       const media = new Media();
  //       const type = file.mimetype.split('/')[0];

  //       if (type === 'image') {
  //         media.type = 'image';
  //       } else if (type === 'video') {
  //         media.type = 'video';
  //       }

  //       const uploadDir = path.join(__dirname, '../../../uploads/post');
  //       const filePath = path.join(
  //         uploadDir,
  //         `${Date.now()}_${file.originalname}`,
  //       );

  //       if (!fs.existsSync(uploadDir)) {
  //         fs.mkdirSync(uploadDir, { recursive: true });
  //       }

  //       fs.writeFileSync(filePath, file.buffer);
  //       media.link = filePath;
  //       media.post = post;

  //       const existingMedia = await this.mediaRepository.findOne({
  //         where: { post: post },
  //       });
  //       if (existingMedia) {
  //         await this.mediaRepository.delete(existingMedia.id);
  //       }
  //       await this.mediaRepository.save(media);
  //       post.media = media;
  //     }

  //     const savedPost = await this.postRepository.save(post);

  //     const logActivityDto: LogActivityDto = {
  //       actionType: 'update',
  //       objectId: post.id,
  //       objectType: 'post',
  //       details: `User ${user.name} updated a post.`,
  //     };
  //     await this.activityService.logActivity(user, logActivityDto);

  //     return this.postRepository.findOne({
  //       where: { id: savedPost.id },
  //       relations: ['user', 'comments', 'media'],
  //       select: {
  //         user: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           tel: true,
  //           avatar: true,
  //         },
  //         comments: true,
  //       },
  //     });
  //   } catch (error) {
  //     throw new HttpException(
  //       'Error occurred while updating post: ' + error,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'media'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (post.user.id !== userId) {
      throw new HttpException(
        'You do not have permission to update this post',
        HttpStatus.FORBIDDEN,
      );
    }

    post.title = updatePostDto.title;
    post.description = updatePostDto.description;

    try {
      if (file) {
        const media = new Media();
        const type = file.mimetype.split('/')[0];

        if (type === 'image') {
          media.type = 'image';
        } else if (type === 'video') {
          media.type = 'video';
        }

        const uploadDir = path.join(__dirname, '../../../uploads/post');
        const filePath = path.join(
          uploadDir,
          `${Date.now()}_${file.originalname}`,
        );

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, file.buffer);
        media.link = filePath;
        media.post = post;

        const existingMediaByLink = await this.mediaRepository.findOne({
          where: { link: media.link },
        });

        if (existingMediaByLink) {
          throw new HttpException(
            'Duplicate media link detected',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (post.media) {
          await this.mediaRepository.delete(post.media.id);
        }

        await this.mediaRepository.save(media);
        post.media = media;
      }

      const savedPost = await this.postRepository.save(post);

      const logActivityDto: LogActivityDto = {
        actionType: 'update',
        objectId: post.id,
        objectType: 'post',
        details: `User ${user.name} updated a post.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return this.postRepository.findOne({
        where: { id: savedPost.id },
        relations: ['user', 'comments', 'media'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            tel: true,
            avatar: true,
          },
          comments: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error occurred while updating post: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
      },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (post.user.id !== userId) {
      throw new HttpException(
        'You do not have permission to delete this post',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.postRepository.delete(id);

    const logActivityDto: LogActivityDto = {
      actionType: 'delete',
      objectId: post.id,
      objectType: 'post',
      details: `User ${post.user.name} deleted a post.`,
    };
    await this.activityService.logActivity(post.user, logActivityDto);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'media', 'likes', 'group'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
        },
        comments: true,
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  async findAll(filterQuery: ListPostDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);

    const [posts, totalPosts] = await this.postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      relations: ['user', 'media', 'comments', 'likes', 'group'],
      where: [
        { description: Like(`%${searchTerm}%`) },
        { title: Like(`%${searchTerm}%`) },
      ],
      take: itemsPerPage,
      skip: skip,
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
        comments: true,
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });

    const totalPage = Math.ceil(totalPosts / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: posts,
      total: totalPosts,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async getByUserId(id: string): Promise<Post[]> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.postRepository.find({
      where: { user: { id } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'comments', 'media', 'likes', 'group'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
        comments: true,
        media: {
          id: true,
          link: true,
          type: true,
        },
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async getByUserGroup(id: string): Promise<Post[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['groups'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const groupIds = user.groups.map((group) => group.id);
    return await this.postRepository.find({
      where: { group: { id: In(groupIds) } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'comments', 'media', 'likes', 'group'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
        comments: true,
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async getByGroupId(id: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { group: { id } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'comments', 'media', 'likes', 'group'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          tel: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
        },
        comments: true,
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async switchLikeOption(postId: string, userId: string): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (!post.likes) {
      post.likes = [];
    }

    const userLiked = post.likes.some((user) => user.id === userId);
    const like = !userLiked;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (like && !userLiked) {
      post.likes.push({ id: userId } as any);
      await this.postRepository.save(post);

      const logActivityDto: LogActivityDto = {
        actionType: 'like',
        objectId: post.id,
        objectType: 'post',
        details: `User ${user.name} liked a post.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return 'Post liked successfully';
    } else if (!like && userLiked) {
      const initialLikesCount = post.likes.length;
      post.likes = post.likes.filter((user) => user.id !== userId);

      if (initialLikesCount === post.likes.length) {
        return 'User did not like the post';
      }

      await this.postRepository.save(post);

      const logActivityDto: LogActivityDto = {
        actionType: 'unlike',
        objectId: post.id,
        objectType: 'post',
        details: `User ${user.name} unliked a post.`,
      };
      await this.activityService.logActivity(user, logActivityDto);

      return 'Post disliked successfully';
    }

    return like ? 'User already liked the post' : 'User did not like the post';
  }

  async getRecommendedPosts(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'relationships',
        'relationships.user',
        'relationships.friend',
        'groups',
      ],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userPosts = await this.postRepository.find({
      where: { user: { id: userId }, group: IsNull() },
      relations: ['user', 'comments', 'media', 'likes', 'group'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        comments: true,
        media: {
          id: true,
          link: true,
          type: true,
        },
        likes: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });

    const friendIds = user.relationships
      .filter((relationship) => relationship.status === 'accepted')
      .map((relationship) =>
        relationship.user.id === user.id
          ? relationship.friend.id
          : relationship.user.id,
      );

    let postsByFriends = [];
    if (friendIds.length > 0) {
      postsByFriends = await this.postRepository.find({
        where: {
          user: { id: In(friendIds) },
          group: IsNull(),
        },
        relations: ['user', 'comments', 'media', 'likes', 'group'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
          comments: true,
          media: {
            id: true,
            link: true,
            type: true,
          },
          likes: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      });
    }

    const groupIds = user.groups.map((group) => group.id);

    let postsByGroups = [];
    if (groupIds.length > 0) {
      postsByGroups = await this.postRepository.find({
        where: {
          group: { id: In(groupIds) },
        },
        relations: ['user', 'comments', 'media', 'likes', 'group'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
          comments: true,
          media: {
            id: true,
            link: true,
            type: true,
          },
          likes: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      });
    }

    const allPosts = [...userPosts, ...postsByFriends, ...postsByGroups];
    const uniquePosts = Array.from(
      new Set(allPosts.map((post) => post.id)),
    ).map((id) => allPosts.find((post) => post.id === id));

    const sortedPosts = uniquePosts.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );

    return {
      data: sortedPosts,
      total: sortedPosts.length,
      currentPage: 1,
      items_per_page: sortedPosts.length,
      totalPage: 1,
      nextPage: null,
      prePage: null,
    };
  }
}
