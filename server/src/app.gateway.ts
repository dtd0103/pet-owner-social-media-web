// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AppService } from './app.service';
// // import { CreateMessageDto } from './message/dto/create-message.dto';
// // import { UseGuards } from '@nestjs/common';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class AppGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   constructor(private appService: AppService) {}

//   @WebSocketServer() server: Server;

//   afterInit(server: Server) {}

//   handleConnection(client: Socket) {}

//   handleDisconnect(client: Socket) {}

//   //   @SubscribeMessage('sendMessage')
//   //   async handleSendMessage(client: Socket, payload: any): Promise<void> {
//   //     const message = await this.appService.saveMessage(
//   //       payload.sender_id,
//   //       payload.receiver_id,
//   //       payload.group_id,
//   //       payload.content,
//   //     );
//   //     this.server.emit('newMessage', message);
//   //   }
// }
