import { Logger, Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { EmailService } from "src/email/email.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
