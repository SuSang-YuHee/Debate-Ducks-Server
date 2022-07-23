import { CommentEntity } from "src/comments/entities/comment.entity";
import { DebateEntity } from "src/debates/entity/debate.entity";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  debates: DebateEntity[];
  participant_debates: DebateEntity[];
  comments: CommentEntity[];
}
