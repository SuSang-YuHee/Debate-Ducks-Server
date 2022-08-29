import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { VoteEntity } from "src/votes/entity/vote.entity";
import { DebatesController } from "./debates.controller";
import { DebatesService } from "./debates.service";
import { DebateEntity } from "./entity/debate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DebateEntity,
      UserEntity,
      HeartEntity,
      VoteEntity,
    ]),
  ],
  controllers: [DebatesController],
  providers: [DebatesService],
})
export class DebatesModule {}
