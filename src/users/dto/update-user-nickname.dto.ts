import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserNicknameDto {
  @ApiProperty({
    example: "TestUser Or 김철수",
    description: "nickname",
    required: true,
  })
  @IsString()
  @MinLength(2, { message: "수정 할 닉네임은 최소 2글자 이상이어야 합니다." })
  @MaxLength(15, { message: "수정 할 닉네임은 최대 15글자를 넘지 못합니다." })
  nickname: string;
}
