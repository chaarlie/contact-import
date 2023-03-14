import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CsvContactDto } from '../../lib/dtos/csv-contact.dto';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  webSocketServer: Server;

  sendImportFileStatus(
    importFileStatus: string,
  ) {
    this.webSocketServer.emit('import-file-status', importFileStatus);
  }
}
