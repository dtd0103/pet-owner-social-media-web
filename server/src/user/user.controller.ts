import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { ListUserDto } from './dto/list-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiBearerAuth()
@ApiTags('User')
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllUser(@Query() filterQuery: ListUserDto) {
    return this.userService.findAll(filterQuery);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getUserProfile(@Req() req: any) {
    return this.userService.getById(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.tiff',
          '.psd',
          '.raw',
          '.heif',
          '.indd',
          '.jpeg 2000',
          '.pdf',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log(req.user);
    return this.userService.updateAvatar(req.user.id, file);
  }

  @UseGuards(AuthGuard)
  @Post('background')
  @UseInterceptors(
    FileInterceptor('background', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.tiff',
          '.psd',
          '.raw',
          '.heif',
          '.indd',
          '.jpeg 2000',
          '.pdf',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadBackground(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.userService.updateBackground(req.user.id, file);
  }
}
