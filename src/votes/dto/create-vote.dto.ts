import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateVoteDto {
  @ApiProperty({
    example: "TestUserId",
    description: "투표를 한 유저의 id입니다.",
    required: true,
  })
  @IsString()
  target_user_id: string;

  @ApiProperty({
    example: "TestDebateId",
    description: "투표를 한 토론의 id입니다.",
    required: true,
  })
  @IsNumber()
  target_debate_id: number;

  @ApiProperty({
    example: "true",
    description: "찬성 혹은 반대 투표 값입니다.",
    required: true,
  })
  @IsBoolean()
  pros: boolean;
}
