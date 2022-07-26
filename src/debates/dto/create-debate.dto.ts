import { ApiProperty } from "@nestjs/swagger";
import { Matches, MaxLength, MinLength } from "class-validator";

export class CreateDebateDto {
  @ApiProperty({
    example: "토론제목1",
    description: "토론의 제목에 해당합니다.",
    required: true,
  })
  @MinLength(5)
  @MaxLength(80)
  @Matches(/[^\s\w가-힣.,!?%&()]/)
  title: string;

  @ApiProperty({
    example: "TestUserId string",
    description: "토론의 작성자에 해당합니다.",
    required: true,
  })
  author_id: string;

  @ApiProperty({
    example: "true",
    description: "토론 작성자의 찬반측에 해당합니다.",
    required: true,
  })
  author_pros: boolean;

  @ApiProperty({
    example: "경제",
    description: "토론의 주제에 해당합니다.",
    required: true,
  })
  category: string;

  @ApiProperty({
    example: "토론 내용~~~",
    description: "토론활 내용에 해당합니다.",
    required: true,
  })
  contents: string;
}
