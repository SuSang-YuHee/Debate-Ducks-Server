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
const roomDebates = {};
//! roomId: { isClear: false, prosReady, consReady: count: 0,  }

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit() {
    console.log("WebSocket Server Init");
  }

  //* Room and WebRTC 연결 및 연결 해제
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log("connection", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("disconnection", socket.id);
    const roomId = roomIds[socket.id];
    delete roomIds[socket.id];
    socket.to(roomId).emit("peerDisconnect");
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

      if (roomDebates[data.debateId]?.isDebate) {
        socket.emit("debate");
      }
    } else {
      socket.emit("overcapacity");
    }
  }

  @SubscribeMessage("offer")
  handleOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    socket.to(data.debateId).emit("offer", data.signal);
  }

  @SubscribeMessage("answer")
  handleAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    socket.to(data.debateId).emit("answer", data.signal);
  }

  //* 정보 송수신
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

  //* 토론
  @SubscribeMessage("ready")
  handleReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string; isReady: boolean; isPros: boolean },
  ) {
    const isReady = data.isPros ? "isProsReady" : "isConsReady";
    roomDebates[data.debateId] = roomDebates[data.debateId] || {};
    roomDebates[data.debateId][isReady] = data.isReady;
    if (
      roomDebates[data.debateId].isProsReady &&
      roomDebates[data.debateId].isConsReady &&
      !roomDebates[data.debateId].isDebate
    ) {
      //! Maybe 여기에 토론 함수 작성
      roomDebates[data.debateId].isDebate = true;
      socket.emit("debate");
      socket.to(data.debateId).emit("debate");
    }
  }
}
