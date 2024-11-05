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
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        client.data.userId = decoded.sub;
        console.log(
          `Client connected: ${client.id}, User ID: ${client.data.userId}`,
        );
      } catch (error) {
        console.error('Invalid token', error);
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    const senderId = client.data.userId;
    try {
      const message = await this.messageService.create(senderId, payload);
      this.server.emit('newMessage', message);
    } catch (error) {
      client.emit('error', {
        message: 'Failed to send message',
        details: error.message,
      });
    }
  }
}
