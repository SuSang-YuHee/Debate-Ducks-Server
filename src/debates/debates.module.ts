import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DebatesController } from "./debates.controller";
import { DebatesService } from "./debates.service";
import { DebateEntity } from "./entity/debate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DebateEntity])],
  controllers: [DebatesController],
  providers: [DebatesService],
})
export class DebatesModule {}
