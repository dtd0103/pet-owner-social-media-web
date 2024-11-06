import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ListCommentDto } from './dto/list-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: ListCommentDto) {
    return this.commentService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('post/:post_id')
  findAllByPost(@Param('id') postId: string): Promise<Comment[]> {
    return this.commentService.getByPostId(postId);
  }

  @UseGuards(AuthGuard)
  @Get('user/:user_id')
  findAllByUser(@Param('id') userId: string): Promise<Comment[]> {
    return this.commentService.getByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getById(id);
  }

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
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.commentService.create(req.user.id, createCommentDto, file);
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
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Comment> {
    return this.commentService.update(id, req.user.id, updateCommentDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.commentService.remove(id, req.user.id);
  }
}
