import { ApiProperty } from "@nestjs/swagger";

export class SearchDebatesDto {
  @ApiProperty({
    example: "title=검색어",
    description: "토론을 검색할 검색어에 해당합니다.",
    required: true,
  })
  title: string;
}
