import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { FactcheckEntity } from "./entity/factcheck.entity";
import { FactchecksController } from "./factchecks.controller";
import { FactchecksService } from "./factchecks.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FactcheckEntity, UserEntity, DebateEntity]),
  ],
  controllers: [FactchecksController],
  providers: [FactchecksService],
})
export class FactchecksModule {}
