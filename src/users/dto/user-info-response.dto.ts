import { ApiProperty } from "@nestjs/swagger";

export class UserInfoResponseDto {
  @ApiProperty({
    required: true,
    example: "TestUserId",
    description: "유저 id",
  })
  id: string;

  @ApiProperty({
    required: true,
    example: "TestUser Or 김철수",
    description: "유저 nickname",
  })
  nickname: string;

  @ApiProperty({
    required: true,
    example: "test@gmail.com",
    description: "유저 email",
  })
  email: string;

  @ApiProperty({
    required: true,
    example: "uuidv4.fileExtension",
    description: "유저 프로필 사진",
  })
  profile_image: string;
}
