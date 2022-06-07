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
import { roomIds, roomDebates, debate } from "./utils";

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit() {
    console.log("WebSocket Server Init");
  }

  //*- 연결, 입장 및 연결 해제
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log("connection", socket.id);
  }

  // * 연결 해제
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("disconnection", socket.id);

    const roomId = roomIds[socket.id];
    delete roomIds[socket.id];

    if (roomDebates[roomId]) {
      roomDebates[roomId].size -= 1;

      if (roomDebates[roomId].size < 1) {
        if (!roomDebates[roomId].isStart) {
          delete roomDebates[roomId];
        } else {
          roomDebates[roomId].isPause = true;
          clearInterval(roomDebates[roomId].debate);
        }
      }
    }

    socket.to(roomId).emit("peerDisconnect");
  }

  // * 입장
  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string },
  ) {
    const roomSize =
      this.server.sockets.adapter.rooms.get(data.debateId)?.size || 0;
    if (roomSize < 2) {
      console.log("join", data.debateId, socket.id);

      roomIds[socket.id] = data.debateId;
      roomDebates[data.debateId] = roomDebates[data.debateId] || {};
      roomDebates[data.debateId].size = roomDebates[data.debateId].size
        ? roomDebates[data.debateId].size + 1
        : 1;

      socket.join(data.debateId);
      socket.to(data.debateId).emit("guestJoin");

      if (roomDebates[data.debateId]?.isStart) {
        socket.emit("debateStart");

        if (roomDebates[data.debateId]?.isPause) {
          roomDebates[data.debateId].isPause = false;
          roomDebates[data.debateId].debate = setInterval(
            debate,
            1000,
            socket,
            data.debateId,
            roomDebates,
          );
        }
      }
    } else {
      socket.emit("overcapacity");
    }
  }

  // * WebRTC 연결
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

  //*- 정보 송수신
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

  @SubscribeMessage("skip")
  handleSkip(@MessageBody() data: { debateId: string; isPros: boolean }) {
    if (
      roomDebates[data.debateId].timer > 3 &&
      ((data.isPros &&
        (roomDebates[data.debateId].turn === 1 ||
          roomDebates[data.debateId].turn === 4 ||
          roomDebates[data.debateId].turn === 5)) ||
        (!data.isPros &&
          (roomDebates[data.debateId].turn === 2 ||
            roomDebates[data.debateId].turn === 3 ||
            roomDebates[data.debateId].turn === 6)))
    ) {
      roomDebates[data.debateId].timer = 3;
    }
  }

  //*- 토론
  @SubscribeMessage("ready")
  handleReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string; isReady: boolean; isPros: boolean },
  ) {
    if (!data.debateId) return;

    const isReady = data.isPros ? "isProsReady" : "isConsReady";
    roomDebates[data.debateId] = roomDebates[data.debateId] || {};
    roomDebates[data.debateId][isReady] = data.isReady;

    if (
      roomDebates[data.debateId].size === 2 &&
      !roomDebates[data.debateId].isStart &&
      roomDebates[data.debateId].isProsReady &&
      roomDebates[data.debateId].isConsReady
    ) {
      roomDebates[data.debateId].isStart = true;
      socket.emit("debateStart");
      socket.to(data.debateId).emit("debateStart");

      roomDebates[data.debateId].turn = 0;
      roomDebates[data.debateId].timer = 3;
      roomDebates[data.debateId].debate = setInterval(
        debate,
        1000,
        socket,
        data.debateId,
        roomDebates,
      );
    }
  }
}
