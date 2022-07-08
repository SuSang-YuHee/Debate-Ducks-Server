import { Socket } from "socket.io";

interface IRoomId {
  [index: string]: {
    debateId: string;
  };
}

interface IRoomDebates {
  [index: string]: {
    size: 0 | 1 | 2;
    isProsReady: boolean;
    isConsReady: boolean;
    isStart: boolean;
    isPause: boolean;
    turn: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    timer: number;
    debate: NodeJS.Timer;
  };
}

type TDebate = [string, number][];

export const roomOfId: IRoomId = {};

export const idOfRoom: IRoomDebates = {};

export const DEBATE: TDebate = [
  ["", 3],
  ["찬성 측 입론", 240],
  ["반대 측 교차 조사", 180],
  ["반대 측 입론", 240],
  ["찬성 측 교차 조사", 180],
  ["찬성 측 반론 및 요약", 180],
  ["반대 측 반론 및 요약", 180],
  ["토론이 종료되었습니다.", 2],
];

export const debate = (
  socket: Socket,
  debateId: string,
  idOfRoom: IRoomDebates,
) => {
  const data = {
    notice: DEBATE[idOfRoom[debateId].turn][0],
    turn: idOfRoom[debateId].turn,
    timer: idOfRoom[debateId].timer,
  };

  socket.emit("debate", data);
  socket.to(debateId).emit("debate", data);
  idOfRoom[debateId].timer -= 1;

  if (idOfRoom[debateId].turn >= 7) return;

  if (idOfRoom[debateId].timer < 1) {
    idOfRoom[debateId].turn += 1;
    idOfRoom[debateId].timer = DEBATE[idOfRoom[debateId].turn][1];
  }
};
