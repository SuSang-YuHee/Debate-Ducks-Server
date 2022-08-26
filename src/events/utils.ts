import { Socket } from "socket.io";

interface IRoomId {
  [index: string]: string;
}

interface IRoomInfo {
  [index: string]: {
    size: 0 | 1 | 2;
    isProsReady: boolean;
    isConsReady: boolean;
    debate: NodeJS.Timer;
    turn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    time: number;
  };
}

//* key: 소캣 아이디, value: 룸 아이디
export const roomId: IRoomId = {};
//* key: 룸 아이디, value: 룸 정보
export const roomInfo: IRoomInfo = {};
//* 토론 진행 정보
export const DEBATE: [string, number][] = [
  ["토론이 곧 시작됩니다.", 3],
  ["찬성 측 입론", 240],
  ["반대 측 교차 조사", 180],
  ["반대 측 입론", 240],
  ["찬성 측 교차 조사", 180],
  ["찬성 측 반론 및 요약", 180],
  ["반대 측 반론 및 요약", 180],
  ["토론이 종료되었습니다.", 0],
];

//* 토론 진행
export const debate = (
  socket: Socket,
  debateId: string,
  roomInfo: IRoomInfo,
) => {
  if (!roomInfo[debateId]) return;

  const data = {
    notice: DEBATE[roomInfo[debateId].turn][0],
    turn: roomInfo[debateId].turn,
    time: roomInfo[debateId].time,
  };

  roomInfo[debateId].time -= 1;
  socket.emit("debate", data);
  socket.to(debateId).emit("debate", data);

  if (roomInfo[debateId].turn < 7 && roomInfo[debateId].time < 1) {
    roomInfo[debateId].turn += 1;
    roomInfo[debateId].time = DEBATE[roomInfo[debateId].turn][1];
  }
};
