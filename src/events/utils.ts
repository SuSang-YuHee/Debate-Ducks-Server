import { Socket } from "socket.io";

interface IRoomId {
  [index: string]: string;
}

interface IRoomDebates {
  [index: string]: {
    size?: number;
    isProsReady?: boolean;
    isConsReady?: boolean;
    isStart?: boolean;
    isPause?: boolean;
    turn?: number;
    timer?: number;
    debate?: NodeJS.Timer;
  };
}

type TDebate = [string, number][];

export const roomIds: IRoomId = {};

export const roomDebates: IRoomDebates = {};

export const DEBATE_DEFAULT: TDebate = [
  ["잠시 후 토론을 시작합니다.", 3],
  ["긍정측 입론", 240],
  ["부정 측 교차 조사", 180],
  ["부정 측 입론", 240],
  ["긍정 측 교차 조사", 180],
  ["긍정 측 반박", 180],
  ["부정 측 반박", 180],
  ["토론이 종료되었습니다.", 3],
];

export const debate = (
  socket: Socket,
  debateId: string,
  roomDebates: IRoomDebates,
) => {
  const data = {
    notice: DEBATE_DEFAULT[roomDebates[debateId].turn][0],
    turn: roomDebates[debateId].turn,
    timer: roomDebates[debateId].timer,
  };
  socket.emit("debateProgress", data);
  socket.to(debateId).emit("debateProgress", data);
  roomDebates[debateId].timer -= 1;
  if (roomDebates[debateId].timer < 1) {
    roomDebates[debateId].turn += 1;
    roomDebates[debateId].timer = DEBATE_DEFAULT[roomDebates[debateId].turn][1];
  }
};
