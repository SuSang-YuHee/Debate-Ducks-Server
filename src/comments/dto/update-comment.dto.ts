import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
  @ApiProperty({
    example: "1",
    description: "수정 할 댓글의 id입니다.",
    required: true,
  })
  id: number;

  @ApiProperty({
    example: "false",
    description: "수정 할 댓글의 찬성, 반대 값입니다.",
    required: false,
  })
  pros: boolean;

  @ApiProperty({
    example: "TestContents",
    description: "수정 할 댓글의 내용입니다.",
    required: false,
  })
  contents: string;
}
