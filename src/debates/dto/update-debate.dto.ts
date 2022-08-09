import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateDebateDto {
  @ApiProperty({
    example: "1",
    description: "업데이트할 토론의 id 입니다.",
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "수정할 제목",
    description: "업데이트할 토론의 제목 입니다.",
    required: false,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(80)
  @IsOptional()
  title: string;

  @ApiProperty({
    example: "수정할 내용",
    description: "업데이트할 토론의 내용 입니다.",
    required: false,
  })
  @IsString()
  @MaxLength(3000)
  @IsOptional()
  contents: string;

  @ApiProperty({
    example: "수정할 주제",
    description: "업데이트할 토론의 주제 입니다.",
    required: false,
  })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({
    example: "exampleurl",
    description: "업데이트할 토론의 비디오 링크입니다.",
    required: false,
  })
  @IsString()
  @IsOptional()
  video_url: string;

  @ApiProperty({
    example: "2",
    description: "업데이트할 토론의 참석자 id 입니다.",
    required: false,
  })
  @IsString()
  @IsOptional()
  participant_id: string;

  @ApiProperty({
    example: "false",
    description: "토론 생성자의 찬반에 해당합니다.",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  author_pros: boolean;
}
