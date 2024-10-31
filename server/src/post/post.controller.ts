import {
  Controller,
  UseGuards,
  Req,
  UseInterceptors,
  Post,
  Body,
  UploadedFile,
  BadRequestException,
  Param,
  Put,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostDto } from './dto/list-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { extname } from 'path';
@ApiBearerAuth()
@ApiTags('Post')
@Controller('api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @Get('check-payload')
  // checkPayload(@Req() req: any) {
  //   console.log(req.user);
  //   return req.user;
  // }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('media', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedImageExtensions = ['.jpg', '.png', '.jpeg'];
        const allowedVideoExtensions = ['.mp4', '.avi'];

        if (
          !allowedImageExtensions.includes(ext) &&
          !allowedVideoExtensions.includes(ext)
        ) {
          req.fileValidationError = `Invalid file type. Accepted extensions are: ${allowedImageExtensions.concat(allowedVideoExtensions).join(', ')}`;
          return cb(null, false);
        }

        const fileSize = parseInt(req.headers['content-length']);
        if (
          allowedImageExtensions.includes(ext) &&
          fileSize > 1024 * 1024 * 5
        ) {
          req.fileValidationError =
            'File size too large. Maximum size for images is 5 MB.';
          return cb(null, false);
        } else if (
          allowedVideoExtensions.includes(ext) &&
          fileSize > 1024 * 1024 * 50
        ) {
          req.fileValidationError =
            'File size too large. Maximum size for videos is 50 MB.';
          return cb(null, false);
        }

        return cb(null, true);
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    const userId = req.user.id;
    return this.postService.create(userId, createPostDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('media', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedImageExtensions = ['.jpg', '.png', '.jpeg'];
        const allowedVideoExtensions = ['.mp4', '.avi'];

        if (
          !allowedImageExtensions.includes(ext) &&
          !allowedVideoExtensions.includes(ext)
        ) {
          req.fileValidationError = `Invalid file type. Accepted extensions are: ${allowedImageExtensions.concat(allowedVideoExtensions).join(', ')}`;
          return cb(null, false);
        }

        const fileSize = parseInt(req.headers['content-length']);
        if (
          allowedImageExtensions.includes(ext) &&
          fileSize > 1024 * 1024 * 5
        ) {
          req.fileValidationError =
            'File size too large. Maximum size for images is 5 MB.';
          return cb(null, false);
        } else if (
          allowedVideoExtensions.includes(ext) &&
          fileSize > 1024 * 1024 * 50
        ) {
          req.fileValidationError =
            'File size too large. Maximum size for videos is 50 MB.';
          return cb(null, false);
        }

        return cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.postService.update(id, req.user.id, updatePostDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string): Promise<void> {
    return this.postService.delete(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllPost(@Query() filterQuery: ListPostDto) {
    return this.postService.findAll(filterQuery);
  }

  @UseGuards(AuthGuard)
  @Get('/user/groups')
  getPostByUserGroup(@Req() req: any) {
    return this.postService.getByUserGroup(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('group/:id')
  getPostByGroupId(@Param('id') id: string): Promise<PostEntity[]> {
    return this.postService.getByGroupId(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  getPostByUserId(@Param('id') id: string): Promise<PostEntity[]> {
    return this.postService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('/get/recommended')
  getRecommendedPosts(@Req() req: any) {
    return this.postService.getRecommendedPosts(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/like')
  async togglePostLike(@Req() req: any, @Param('id') id: string): Promise<any> {
    await this.postService.switchLikeOption(id, req.user.id);
  }
}
