import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class IsVotedDto {
  @ApiProperty({
    example: "TestUserId",
    description: "투표 여부를 확인 할 유저의 id 입니다.",
    required: true,
  })
  target_user_id: string;

  @ApiProperty({
    example: "1",
    description: "투표 여부를 확인 할 토론의 id 입니다.",
    required: true,
  })
  target_debate_id: number;
}
