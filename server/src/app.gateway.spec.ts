import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { MessageService } from './message/message.service';
import { JwtService } from '@nestjs/jwt';

import { Message } from './message/entities/message.entity';

describe('AppGateway', () => {
  let gateway: AppGateway;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppGateway,
        {
          provide: MessageService,
          useValue: {
            create: jest.fn(), // Mô phỏng hàm create của MessageService
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(), // Mô phỏng hàm verify của JwtService
          },
        },
      ],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleSendMessage', () => {
    it('should call messageService.create and emit newMessage event', async () => {
      const client = {
        data: {},
        emit: jest.fn(),
      } as any;

      const payload = { content: 'Hello', receiverId: '123' };
      const senderId = '456';

      // Tạo một đối tượng message đầy đủ
      const message: Message = {
        id: '1',
        content: 'Hello',
        sender: { id: senderId } as any,
        receiver: null,
        group: null,
        media: null,
        sendAt: new Date(),
      };

      // Mô phỏng việc xác thực và trả về ID người gửi
      gateway.handleConnection(client);
      client.data.userId = senderId;

      jest.spyOn(messageService, 'create').mockResolvedValue(message);

      await gateway.handleSendMessage(client, payload);

      expect(messageService.create).toHaveBeenCalledWith(senderId, payload);
      expect(client.emit).toHaveBeenCalledWith('newMessage', message);
    });

    it('should emit error when messageService.create throws error', async () => {
      const client = {
        data: {},
        emit: jest.fn(),
      } as any;
      const payload = { content: 'Hello', receiverId: '123' };
      const senderId = '456';

      // Mô phỏng việc xác thực và trả về ID người gửi
      gateway.handleConnection(client);
      client.data.userId = senderId;

      jest
        .spyOn(messageService, 'create')
        .mockRejectedValue(new Error('Error'));

      await gateway.handleSendMessage(client, payload);

      expect(client.emit).toHaveBeenCalledWith('error', {
        message: 'Failed to send message',
        details: 'Error',
      });
    });
  });
});
