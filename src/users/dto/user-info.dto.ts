import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {
  @ApiProperty({
    required: true,
    example: "string",
    description: "유저 id",
  })
  id: string;

  @ApiProperty({
    required: true,
    example: "TestUser Or 김철수",
    description: "유저 nickname",
  })
  name: string;

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
