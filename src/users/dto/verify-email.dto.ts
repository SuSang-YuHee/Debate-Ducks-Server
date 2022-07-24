import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailDto {
  @ApiProperty({
    description: "signupVerifyToken",
    required: true,
  })
  signupVerifyToken: string;
}
