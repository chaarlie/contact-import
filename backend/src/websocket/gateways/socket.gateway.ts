import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CsvContactDto } from '../../lib/dtos/csv-contact.dto';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  webSocketServer: Server;

  sendContacts(
    contacts: Omit<CsvContactDto, 'creditCardNumber' | 'user' | 'importFile'>[],
  ) {
    this.webSocketServer.emit('contacts', contacts);
  }
}
