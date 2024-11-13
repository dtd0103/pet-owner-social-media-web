import {
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
import { GroupService } from './group.service';
import { ListGroupDto } from './dto/list-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Group } from './entities/group.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateGroupDto } from './dto/create-group.dto';
import { extname } from 'path';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiBearerAuth()
@ApiTags('Group')
@Controller('api/v1/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard)
  @Get('/all')
  getAll() {
    return this.groupService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllGroup(@Query() filterQuery: ListGroupDto) {
    return this.groupService.findAll(filterQuery);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUserGroup(@Req() req: any): Promise<Group[]> {
    return this.groupService.getByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getGroupById(@Param('id') id: string): Promise<Group> {
    return this.groupService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  getGroupByUserId(@Param('id') id: string): Promise<Group[]> {
    return this.groupService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Post()
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
  createGroup(
    @Req() req: any,
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.groupService.create(req.user.id, createGroupDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
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
  updateGroup(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.groupService.update(req.user.id, id, updateGroupDto, file);
  }

  @UseGuards(AuthGuard)
  @Post(':id/join')
  join(@Req() req: any, @Param('id') id: string) {
    return this.groupService.join(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/leave')
  leave(@Req() req: any, @Param('id') id: string) {
    return this.groupService.leave(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.groupService.remove(req.user.id, id);
  }
}
