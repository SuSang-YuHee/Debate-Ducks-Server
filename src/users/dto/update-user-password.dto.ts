import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserPasswordDto {
  @ApiProperty({
    example: "prev password string",
    description: "이전 비밀번호",
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  prevPassword: string;

  @ApiProperty({
    example: "next password string",
    description: "변경할 비밀번호",
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  nextPassword: string;
}
