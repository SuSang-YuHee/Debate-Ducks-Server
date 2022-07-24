import { ApiProperty } from "@nestjs/swagger";

export class HeartDto {
  @ApiProperty({
    example: "TestUserId",
    description: "좋아요를 한 유저의 id입니다.",
    required: true,
  })
  target_user_id: string;

  @ApiProperty({
    example: "1",
    description: "좋아요를 한 토론의 id입니다.",
    required: true,
  })
  target_debate_id: number;
}
