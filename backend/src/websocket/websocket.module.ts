import { Module } from '@nestjs/common';
import { SocketGateway } from './gateways/socket.gateway';

@Module({
  providers: [SocketGateway],
})
export class WebSocketModule {}
