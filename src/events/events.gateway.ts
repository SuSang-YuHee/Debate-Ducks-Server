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
import Peer from "simple-peer";

const roomIds = {};

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit() {
    console.log("WebSocket Server Init");
  }

  // Connect and Disconnect
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log("connection", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("disconnection", socket.id);
    const roomId = roomIds[socket.id];
    delete roomIds[socket.id];
    socket.to(roomId).emit("peerDisconnect", socket.id);
  }

  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string },
  ) {
    const roomSize =
      this.server.sockets.adapter.rooms.get(data.debateId)?.size || 0;
    if (roomSize < 2) {
      roomIds[socket.id] = data.debateId;
      socket.join(data.debateId);
      socket.to(data.debateId).emit("guestJoin");
    } else {
      socket.emit("overcapacity");
    }
  }

  @SubscribeMessage("offer")
  handleOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    console.log("offer"); //!
    socket.to(data.debateId).emit("offer", data.signal);
  }

  @SubscribeMessage("answer")
  handleAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    console.log("answer"); //!
    socket.to(data.debateId).emit("answer", data.signal);
  }

  // On and Off
  @SubscribeMessage("peerVideo")
  handlePeerVideo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; isVideoOn: boolean },
  ) {
    socket.to(data.debateId).emit("peerVideo", data.isVideoOn);
  }

  @SubscribeMessage("peerScreen")
  handlePeerScreen(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; isScreenOn: boolean },
  ) {
    socket.to(data.debateId).emit("peerScreen", data.isScreenOn);
  }
}
