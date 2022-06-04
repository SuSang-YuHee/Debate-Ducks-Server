import { Socket } from "socket.io";
import { Blob } from "buffer";

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
    blobs?: Blob[];
  };
}

type TDebate = [string, number][];

export const roomIds: IRoomId = {};

export const roomDebates: IRoomDebates = {};

export const DEBATE_DEFAULT: TDebate = [
  ["", 3],
  ["찬성 측 입론", 240],
  ["반대 측 교차 조사", 180],
  ["반대 측 입론", 240],
  ["찬성 측 교차 조사", 180],
  ["찬성 측 반론 및 요약", 180],
  ["반대 측 반론 및 요약", 180],
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

  if (roomDebates[debateId].timer < 1 && roomDebates[debateId].turn < 7) {
    roomDebates[debateId].turn += 1;
    roomDebates[debateId].timer = DEBATE_DEFAULT[roomDebates[debateId].turn][1];
  }
};
