import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { NotIn } from "src/utils/decorators/not-in";

export class CreateUserDto {
  @ApiProperty({
    example: "TestUser Or 김철수",
    description: "nickname",
    required: true,
  })
  @Transform((params) => params.value.trim())
  @NotIn("password", {
    message: "password는 name과 같은 문자열을 포함할 수 없습니다.",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  readonly name: string;

  @ApiProperty({
    example: "test@gmail.com",
    description: "email",
    required: true,
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @ApiProperty({
    example: "TestPassword098672!!",
    description: "password",
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
