import { ApiProperty } from "@nestjs/swagger";

export class SearchDebatesDto {
  @ApiProperty({
    example: "검색어",
    description: "토론을 검색할 검색어에 해당합니다.",
    required: true,
  })
  title: string;

  @ApiProperty({
    example: "ASC",
    description: "토론 리스트 정렬에 해당합니다.",
    required: false,
  })
  order: "ASC" | "DESC";

  @ApiProperty({
    example: "9",
    description: "토론 리스트에 담을 토론 개수에 해당합니다.",
    required: false,
  })
  count: number;

  @ApiProperty({
    example: "1",
    description: "토론 리스트의 페이지에 해당합니다.",
    required: false,
  })
  page: number;
}
