import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    example: "TestUser Or 김철수",
    description: "nickname",
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nickname: string;
}
