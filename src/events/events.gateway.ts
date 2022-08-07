import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } }) //Todo: 주소 지정 필요
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  afterInit() {
    console.log("WebSocket Server Init");
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
