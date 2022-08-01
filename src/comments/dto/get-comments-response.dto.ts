import { ApiProperty } from "@nestjs/swagger";
import { CommentEntity } from "../entities/comment.entity";

export class GetCommentsResponseDto {
  @ApiProperty({
    description: "댓글 리스트입니다.",
  })
  list: CommentEntity[];

  @ApiProperty({
    description: "댓글 리스트를 조회할 때 마지막 페이지인지의 여부입니다.",
  })
  isLast: boolean;
}
