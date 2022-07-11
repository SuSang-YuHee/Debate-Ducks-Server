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
import { roomOfId, idOfRoom, debate } from "./utils";

@WebSocketGateway({ cors: { origin: "*" } }) //! 주소 지정 필요
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

    if (roomSize < 2) {
      console.log("join", data.debateId, socket.id);

      roomOfId[socket.id] = { debateId: data.debateId };
      idOfRoom[data.debateId] = idOfRoom[data.debateId] || {
        size: 0,
        isProsReady: false,
        isConsReady: false,
        isStart: false,
        isPause: false,
        turn: -1,
        timer: -1,
        debate: null,
      };

      idOfRoom[data.debateId].size += 1;

      socket.join(data.debateId);
      socket.to(data.debateId).emit("guestJoin");

      if (!idOfRoom[data.debateId].isStart) return;

      socket.emit("debateStart");

      if (!idOfRoom[data.debateId].isPause) return;

      idOfRoom[data.debateId].isPause = false;
      idOfRoom[data.debateId].debate = setInterval(
        debate,
        1000,
        socket,
        data.debateId,
        idOfRoom,
      );
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
    if (!roomOfId[socket.id]) return;

    const debateId = roomOfId[socket.id].debateId;

    delete roomOfId[socket.id];

    if (!idOfRoom[debateId]) return;

    console.log("disconnection", debateId, socket.id);

    idOfRoom[debateId].size -= 1;

    socket.to(debateId).emit("peerDisconnect");

    if (idOfRoom[debateId].size > 0) return;

    if (!idOfRoom[debateId].isStart) {
      delete idOfRoom[debateId];
    } else {
      idOfRoom[debateId].isPause = true;
      clearInterval(idOfRoom[debateId].debate);
    }
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
      idOfRoom[data.debateId].timer > 1 &&
      ((data.isPros &&
        (idOfRoom[data.debateId].turn === 1 ||
          idOfRoom[data.debateId].turn === 4 ||
          idOfRoom[data.debateId].turn === 5)) ||
        (!data.isPros &&
          (idOfRoom[data.debateId].turn === 2 ||
            idOfRoom[data.debateId].turn === 3 ||
            idOfRoom[data.debateId].turn === 6)))
    ) {
      idOfRoom[data.debateId].timer = 1;
    }
  }

  //*- 토론 시작
  @SubscribeMessage("ready")
  handleReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string; isReady: boolean; isPros: boolean },
  ) {
    if (!idOfRoom[data.debateId]) return;

    const isReady = data.isPros ? "isProsReady" : "isConsReady";
    idOfRoom[data.debateId][isReady] = data.isReady;

    if (
      idOfRoom[data.debateId].size === 2 &&
      !idOfRoom[data.debateId].isStart &&
      idOfRoom[data.debateId].isProsReady &&
      idOfRoom[data.debateId].isConsReady
    ) {
      idOfRoom[data.debateId].isStart = true;

      idOfRoom[data.debateId].turn = 0;
      idOfRoom[data.debateId].timer = 3;
      idOfRoom[data.debateId].debate = setInterval(
        debate,
        1000,
        socket,
        data.debateId,
        idOfRoom,
      );

      socket.emit("debateStart");
      socket.to(data.debateId).emit("debateStart");
    }
  }

  //*- 토론 종료
  @SubscribeMessage("debateDone")
  handleDebateDone(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: { debateId: string },
  ) {
    if (!idOfRoom[data.debateId]) return;

    socket.emit("debateDone", true);
    socket.to(data.debateId).emit("debateDone", false);

    clearInterval(idOfRoom[data.debateId].debate);
    delete idOfRoom[data.debateId];
  }
}
