import { Module } from "@nestjs/common";
import { HeartsService } from "./hearts.service";
import { HeartsController } from "./hearts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeartEntity } from "./entities/heart.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { DebateEntity } from "src/debates/entity/debate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HeartEntity, UserEntity, DebateEntity])],
  controllers: [HeartsController],
  providers: [HeartsService],
})
export class HeartsModule {}
