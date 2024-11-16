import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Req,
  UseGuards,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Message')
@Controller('api/v1/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  getAll() {
    return this.messageService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('conversations/all')
  getAllUserConversation(@Req() req: any): Promise<Message[]> {
    return this.messageService.getAllUserConversation(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('sender/:sender_id')
  findAllBySender(@Param('sender_id') sender_id: string): Promise<Message[]> {
    return this.messageService.findAllBySender(sender_id);
  }

  @UseGuards(AuthGuard)
  @Get('receiver/:receiver_id')
  findAllByReceiver(
    @Param('receiver_id') receiverId: string,
  ): Promise<Message[]> {
    return this.messageService.findAllByReceiver(receiverId);
  }

  @UseGuards(AuthGuard)
  @Get('my-messages-to/:receiver_id')
  findMyMessagesTo(@Req() req: any, @Param('receiver_id') receiverId: string) {
    return this.messageService.findMyMessagesTo(req.user.id, receiverId);
  }

  @UseGuards(AuthGuard)
  @Get('conversation/user/:user_id')
  getUserConversation(
    @Req() req: any,
    @Param('user_id') user_id: string,
  ): Promise<Message[]> {
    return this.messageService.getUserConversation(req.user.id, user_id);
  }

  @UseGuards(AuthGuard)
  @Get('conversation/group/:group_id')
  getGroupConversation(
    @Req() req: any,
    @Param('group_id') group_id: string,
  ): Promise<Message[]> {
    return this.messageService.getGroupConversation(req.user.id, group_id);
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
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.create(req.user.id, createMessageDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.messageService.remove(id);
  }
}
