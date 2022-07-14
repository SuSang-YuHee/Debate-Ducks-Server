import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { VoteEntity } from "./entity/vote.entity";
import { VotesController } from "./votes.controller";
import { VotesService } from "./votes.service";

@Module({
  imports: [TypeOrmModule.forFeature([VoteEntity, UserEntity, DebateEntity])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
