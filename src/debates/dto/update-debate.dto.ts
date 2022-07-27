import { ApiProperty } from "@nestjs/swagger";

export class UpdateDebateDto {
  @ApiProperty({
    example: "1",
    description: "업데이트할 토론의 id 입니다.",
  })
  id: number;

  @ApiProperty({
    example: "수정할 제목",
    description: "업데이트할 토론의 제목 입니다.",
    required: false,
  })
  title: string;

  @ApiProperty({
    example: "수정할 내용",
    description: "업데이트할 토론의 내용 입니다.",
    required: false,
  })
  contents: string;

  @ApiProperty({
    example: "수정할 주제",
    description: "업데이트할 토론의 주제 입니다.",
    required: false,
  })
  category: string;

  @ApiProperty({
    example: "exampleurl",
    description: "업데이트할 토론의 비디오 링크입니다.",
    required: false,
  })
  video_url: string;

  @ApiProperty({
    example: "2",
    description: "업데이트할 토론의 참석자 id 입니다.",
    required: false,
  })
  participant_id: string;

  @ApiProperty({
    example: "false",
    description: "토론 생성자의 찬반에 해당합니다.",
    required: false,
  })
  author_pros: boolean;
}
