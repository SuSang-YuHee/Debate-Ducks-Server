import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import Peer from "simple-peer";
import { roomId, roomInfo, debate } from "./utils";

@WebSocketGateway({ cors: { origin: "*" } }) //Todo: 주소 지정 필요
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  afterInit() {
    console.log("WebSocket Server Init");
  }

  //*- 연결
  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string },
  ) {
    const roomSize =
      this.server.sockets.adapter.rooms.get(data.debateId)?.size || 0;

    if (roomSize < 2 && !roomId[socket.id]) {
      roomId[socket.id] = data.debateId;
      roomInfo[data.debateId] = roomInfo[data.debateId] || {
        size: 0,
        isProsReady: false,
        isConsReady: false,
        debate: null,
        turn: 0,
        time: 3,
      };

      roomInfo[data.debateId].size += 1;
      socket.join(data.debateId);
      socket.to(data.debateId).emit("peerJoin");
    } else if (roomId[socket.id]) {
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

  //*- 연결 해제
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    if (!roomId[socket.id]) return;
    const debateId = roomId[socket.id];
    delete roomId[socket.id];

    if (!roomInfo[debateId]) return;
    roomInfo[debateId].size -= 1;
    socket.to(debateId).emit("peerDisconnect");

    if (roomInfo[debateId].size >= 1) return;
    if (roomInfo[debateId].debate) {
      clearInterval(roomInfo[debateId].debate);
    }
    delete roomInfo[debateId];
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

  @SubscribeMessage("ready")
  handleReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string; isReady: boolean; isPros: boolean },
  ) {
    if (!roomInfo[data.debateId]) return;

    const isReady = data.isPros ? "isProsReady" : "isConsReady";
    roomInfo[data.debateId][isReady] = data.isReady;

    if (
      roomInfo[data.debateId].isProsReady &&
      roomInfo[data.debateId].isConsReady
    ) {
      roomInfo[data.debateId].debate = setInterval(
        debate,
        1000,
        socket,
        data.debateId,
        roomInfo,
      );
      socket.emit("debateStart");
      socket.to(data.debateId).emit("debateStart");
    }
  }

  @SubscribeMessage("skip")
  handleSkip(@MessageBody() data: { debateId: string; isPros: boolean }) {
    if (!roomInfo[data.debateId]) return;
    if (
      //! roomInfo[data.debateId].time < 60 &&
      roomInfo[data.debateId].time > 1 &&
      ((data.isPros &&
        (roomInfo[data.debateId].turn === 1 ||
          roomInfo[data.debateId].turn === 4 ||
          roomInfo[data.debateId].turn === 5)) ||
        (!data.isPros &&
          (roomInfo[data.debateId].turn === 2 ||
            roomInfo[data.debateId].turn === 3 ||
            roomInfo[data.debateId].turn === 6)))
    ) {
      roomInfo[data.debateId].time = 1;
    }
  }

  //*- 토론 종료
  @SubscribeMessage("debateDone")
  handleDebateDone(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string },
  ) {
    if (roomInfo[data.debateId]) {
      clearInterval(roomInfo[data.debateId].debate);
      delete roomInfo[data.debateId];
      socket.emit("debateDone", true);
      socket.to(data.debateId).emit("debateDone", false);
    }
  }
}
