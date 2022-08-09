import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateDebateDto {
  @ApiProperty({
    example: "토론제목1",
    description: "토론의 제목에 해당합니다.",
    required: true,
  })
  @MinLength(5)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: "TestUserId string",
    description: "토론의 작성자에 해당합니다.",
    required: true,
  })
  @IsString()
  author_id: string;

  @ApiProperty({
    example: "true",
    description: "토론 작성자의 찬반측에 해당합니다.",
    required: true,
  })
  @IsBoolean()
  author_pros: boolean;

  @ApiProperty({
    example: "경제",
    description: "토론 주제의 종류에 해당합니다.",
    required: true,
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: "토론 내용~~~",
    description: "토론활 내용에 해당합니다.",
    required: true,
  })
  @IsString()
  @MaxLength(3000)
  contents: string;
}
