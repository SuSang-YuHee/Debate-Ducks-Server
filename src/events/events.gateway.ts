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
import { roomOfId, idOfRoom, debate, pause } from "./utils";

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
    @MessageBody() data: { debateId: string; isPros: boolean },
  ) {
    const roomSize =
      this.server.sockets.adapter.rooms.get(data.debateId)?.size || 0;

    if (roomSize < 2) {
      console.log(`Join / Debate: ${data.debateId} / Id: ${socket.id}`);
      roomOfId[socket.id] = { debateId: data.debateId, isPros: data.isPros };
      idOfRoom[data.debateId] = idOfRoom[data.debateId] || {
        size: 0,
        isProsReady: false,
        isConsReady: false,
        isStart: false,
        turn: -1,
        timer: -1,
        debate: null,
        pausePros: 3,
        pauseCons: 3,
        pauseTimer: 60,
        pause: null,
        blobs: [],
      };

      if (idOfRoom[data.debateId].pause) {
        clearInterval(idOfRoom[data.debateId].pause);
      }

      if (idOfRoom[data.debateId].pausePros < 0) {
        console.log("토론 패배", "pausePros"); //Todo:
        return;
      }

      if (idOfRoom[data.debateId].pauseCons < 0) {
        console.log("토론 패배", "pauseCons"); //Todo:
        return;
      }

      idOfRoom[data.debateId].size += 1;
      socket.join(data.debateId);
      socket.to(data.debateId).emit("guestJoin");

      if (!idOfRoom[data.debateId].isStart) return;

      socket.emit("debateStart");
      socket.emit("debatePause", true);

      if (idOfRoom[data.debateId].size >= 2) {
        idOfRoom[data.debateId].debate = setInterval(
          debate,
          1000,
          socket,
          data.debateId,
          idOfRoom,
        );
        socket.emit("debatePause", false);
        socket.to(data.debateId).emit("debatePause", false);
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

  //*- 연결 해제
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    if (!roomOfId[socket.id]) return;

    const debateId = roomOfId[socket.id].debateId;
    const isPros = roomOfId[socket.id].isPros;
    const isPause = isPros ? "pausePros" : "pauseCons";
    delete roomOfId[socket.id];

    if (!idOfRoom[debateId]) return;

    console.log(`Disconnection / Debate: ${debateId} / Id: ${socket.id}`);
    idOfRoom[debateId].size -= 1;
    socket.to(debateId).emit("peerDisconnect");

    if (!idOfRoom[debateId].isStart) {
      delete idOfRoom[debateId];
      return;
    }

    if (idOfRoom[debateId].size >= 1) {
      idOfRoom[debateId][isPause] -= 1;
      return;
    }

    clearInterval(idOfRoom[debateId].debate);
    idOfRoom[debateId].pauseTimer = 60;
    idOfRoom[debateId].pause = setInterval(pause, 1000, debateId, idOfRoom);
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
    data: { debateId: string; winner: boolean },
  ) {
    if (!idOfRoom[data.debateId]) return;

    console.log("토론 종료", data.winner); //!

    clearInterval(idOfRoom[data.debateId].debate);
    delete idOfRoom[data.debateId];
  }
}
