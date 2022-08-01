import { ApiProperty } from "@nestjs/swagger";

export class IsVotedResponseDto {
  @ApiProperty({
    description: "투표 여부",
  })
  isVote: boolean;

  @ApiProperty({
    description: "찬성/반대",
  })
  pros: boolean;
}
