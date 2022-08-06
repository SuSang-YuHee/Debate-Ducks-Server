import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserNicknameDto {
  @ApiProperty({
    example: "TestUser Or 김철수",
    description: "nickname",
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  nickname: string;
}
