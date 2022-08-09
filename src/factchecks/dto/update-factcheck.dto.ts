import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFactcheckDto {
  @ApiProperty({
    example: "1",
    description: "수정할 팩트체크의 id입니다",
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "testContents~~~",
    description: "수정할 팩트체크의 설명, 내용 부분입니다.",
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: "testUrl",
    description: "수정할 팩트체크의 설명, 내용을 뒷받침하는 자료의 링크입니다.",
    required: false,
  })
  @IsString()
  @IsOptional()
  reference_url: string;
}
