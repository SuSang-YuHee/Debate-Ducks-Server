import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetCommentsDto {
  @ApiProperty({
    example: "1",
    description: "조회 할 리스트의 페이지입니다.",
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    example: "DESC",
    description: "조회 할 리스트의 정렬입니다.",
    required: false,
  })
  @IsOptional()
  order: "ASC" | "DESC";

  @ApiProperty({
    example: "9",
    description: "리스트의 목록 개수입니다.",
    required: false,
  })
  @IsOptional()
  take: number;
}
