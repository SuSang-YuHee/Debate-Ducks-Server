import { CommentEntity } from "../entities/comment.entity";

export class GetCommentsResponseDto {
  list: CommentEntity[];
  isLast: boolean;
}
