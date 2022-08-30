import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { UserEntity } from "src/users/entity/user.entity";

export class DebateInfoResponseDto {
  @ApiProperty({
    example: "TestUserId",
    description: "유저 id",
  })
  id: number;

  @ApiProperty({
    example: "경제",
    description: "토론 주제의 종류에 해당합니다.",
  })
  category: string;

  @ApiProperty({
    example: "토론제목1",
    description: "토론의 제목에 해당합니다.",
  })
  title: string;

  @ApiProperty({
    example: "토론 내용",
    description: "토론활 내용에 해당합니다.",
  })
  contents: string;

  @ApiProperty({
    example: "exampleurl",
    description: "업데이트할 토론의 비디오 링크입니다.",
  })
  video_url: string;

  @ApiProperty({
    example: "true",
    description: "토론 작성자의 찬반측에 해당합니다.",
  })
  @IsBoolean()
  author_pros: boolean;

  @ApiProperty({
    description: "해당 토론의 생성일시입니다.",
  })
  created_date: Date;

  @ApiProperty({
    description: "해당 토론의 수정일시입니다.",
  })
  updated_date: Date;

  @ApiProperty({
    description: "해당 토론 작성자의 정보입니다.",
  })
  author: UserEntity;

  @ApiProperty({
    description: "해당 토론 참석자의 정보입니다.",
  })
  participant: UserEntity;

  @ApiProperty({
    description: "해당 토론의 팩트체크 정보입니다.",
  })
  factchecks: FactcheckEntity[];

  @ApiProperty({
    description: "해당 토론이 받은 좋아요의 수입니다.",
  })
  hearts_cnt: number;

  @ApiProperty({
    description: "해당 토론에 찬반측이 투표 받은 수입니다.",
  })
  vote: {
    prosCnt: number;
    consCnt: number;
  };
}
