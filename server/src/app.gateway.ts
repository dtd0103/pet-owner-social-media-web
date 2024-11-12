import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './message/dto/create-message.dto';
import { MessageService } from './message/message.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private userSockets = new Map<string, string>();

  constructor(
    private messageService: MessageService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        client.data = decoded;

        this.userSockets.set(client.data.id, client.id);

        console.log(
          `Client connected: ${client.id}, User ID: ${client.data.id}`,
        );

        this.server.emit('userStatus', {
          userId: client.data.id,
          status: 'online',
        });
      } catch (error) {
        console.error('Invalid token', error);
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.userSockets.delete(client.data.id);
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('userStatus', {
      userId: client.data.id,
      status: 'offline',
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    const senderId = client.data.id;
    const { receiverId, groupId } = payload;
    console.log(payload);
    try {
      const message = await this.messageService.create(senderId, payload);

      if (receiverId) {
        const receiverSocketId = this.userSockets.get(receiverId);

        if (receiverSocketId) {
          this.server.to(receiverSocketId).emit('newMessage', message);
        } else {
          console.log(`Receiver with ID ${receiverId} is not connected.`);
        }
      } else if (groupId) {
        this.server.to(groupId).emit('newMessage', message);
      }
      client.emit('newMessage', message);
    } catch (error) {
      client.emit('error', {
        message: 'Failed to send message',
        details: error.message,
      });
    }
  }
}
