import { ApiProperty } from "@nestjs/swagger";

export class GetVoteCountResponseDto {
  @ApiProperty({
    description: "찬성 개수",
  })
  pros_count: number;

  @ApiProperty({
    description: "반대 개수",
  })
  cons_count: number;
}
