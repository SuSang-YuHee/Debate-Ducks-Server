import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class HeartDto {
  @ApiProperty({
    example: "TestUserId",
    description: "좋아요를 한 유저의 id입니다.",
    required: true,
  })
  @IsString()
  target_user_id: string;

  @ApiProperty({
    example: "1",
    description: "좋아요를 한 토론의 id입니다.",
    required: true,
  })
  @IsNumber()
  target_debate_id: number;
}
