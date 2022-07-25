import { ApiProperty } from "@nestjs/swagger";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { UserEntity } from "src/users/entity/user.entity";

export interface DebateInfo {
  id: number;
  category: string;
  title: string;
  contents: string;
  video_url: string;
  author_pros: boolean;
  created_date: Date;
  updated_date: Date;
  author: UserEntity;
  participant: UserEntity;
  factchecks: FactcheckEntity[];
  heartCnt: number;
  vote: {
    prosCnt: number;
    consCnt: number;
  };
}
