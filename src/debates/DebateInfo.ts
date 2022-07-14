import { UserEntity } from "src/users/entity/user.entity";

export interface DebateInfo {
  id: number;
  author: UserEntity;
  title: string;
  contents: string;
  category: string;
  video_url: string;
  participant: UserEntity;
  author_pros: boolean;
  created_date: Date;
  updated_date: Date;
  ended_date: Date;
}
