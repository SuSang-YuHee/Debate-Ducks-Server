import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    example: "TestUser Or 김철수",
    description: "nickname",
    required: true,
  })
  nickname: string;
}
