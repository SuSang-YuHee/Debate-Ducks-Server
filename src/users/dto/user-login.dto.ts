import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength } from "class-validator";

export class UserLoginDto {
  @ApiProperty({
    example: "test@gmail.com",
    description: "email",
    required: true,
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  email: string;

  @ApiProperty({
    example: "TestPassword0548253##!",
    description: "password",
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}
