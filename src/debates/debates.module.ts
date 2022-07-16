import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { DebatesController } from "./debates.controller";
import { DebatesService } from "./debates.service";
import { DebateEntity } from "./entity/debate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DebateEntity, UserEntity])],
  controllers: [DebatesController],
  providers: [DebatesService],
})
export class DebatesModule {}
