import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() debateId: string,
  ) {
    const roomSize = this.server.sockets.adapter.rooms.get(debateId)?.size || 0;
    if (roomSize < 2) {
      socket.join(debateId);
      socket.to(debateId).emit("guestJoin");
    } else {
      socket.emit("overcapacity");
    }
  }

  afterInit(): void {
    console.log("WebSocket Server Init");
  }

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log("connected", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    console.log("disconnected", socket.id);
  }
}
