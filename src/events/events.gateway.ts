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

@WebSocketGateway({ cors: { origin: "*" } }) //Todo: 주소 지정 필요 / but 환경 변수가 안먹힘 / 직접 적어넣은 주소는 가능
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
      //* 2명까지 입장 가능, 중복 입장 방지
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
      //* 중복 입장 시 거절 방지
    } else {
      //* 2인 초과 시 거절
      socket.emit("overcapacity");
    }
  }

  //* WebRTC 제안
  @SubscribeMessage("offer")
  handleOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    socket.to(data.debateId).emit("offer", data.signal);
  }

  //* WebRTC 응답
  @SubscribeMessage("answer")
  handleAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; signal: Peer.SignalData },
  ) {
    socket.to(data.debateId).emit("answer", data.signal);
  }

  //*- 연결 해제
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    //* 룸 아이디 획득 후 삭제
    if (!roomId[socket.id]) return;
    const debateId = roomId[socket.id];
    delete roomId[socket.id];

    //* 퇴장 처리
    if (!roomInfo[debateId]) return;
    roomInfo[debateId].size -= 1;
    socket.to(debateId).emit("peerDisconnect");

    //* 마지막 퇴장 시 토론 중단 및 삭제
    if (roomInfo[debateId].size >= 1) return;
    if (roomInfo[debateId].debate) {
      clearInterval(roomInfo[debateId].debate);
    }
    delete roomInfo[debateId];
  }

  //*- 정보 송수신
  //* 상대 비디오 끄기/켜기 정보
  @SubscribeMessage("peerVideo")
  handlePeerVideo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; isVideoOn: boolean },
  ) {
    socket.to(data.debateId).emit("peerVideo", data.isVideoOn);
  }

  //* 상대 화면 공유 끄기/켜기 정보
  @SubscribeMessage("peerScreen")
  handlePeerScreen(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { debateId: string; isScreenOn: boolean },
  ) {
    socket.to(data.debateId).emit("peerScreen", data.isScreenOn);
  }

  //* 토론 시작 중비 정보
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

  //* 2분 미만이며 자신의 차례일 경우 넘기기
  @SubscribeMessage("skip")
  handleSkip(@MessageBody() data: { debateId: string; isPros: boolean }) {
    if (!roomInfo[data.debateId]) return;
    if (
      roomInfo[data.debateId].time < 120 &&
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
      //* 먼저 요청온 사용자만 업로드 로직 실행
      socket.emit("debateDone", true);
      socket.to(data.debateId).emit("debateDone", false);
    }
  }
}
