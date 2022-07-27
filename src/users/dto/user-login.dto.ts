import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
  @ApiProperty({
    example: "test@gmail.com",
    description: "email",
    required: true,
  })
  email: string;

  @ApiProperty({
    example: "TestPassword0548253##!",
    description: "password",
    required: true,
  })
  password: string;
}
