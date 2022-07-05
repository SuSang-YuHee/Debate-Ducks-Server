import { Module } from "@nestjs/common";
import { DebatesController } from "./debates.controller";
import { DebatesService } from "./debates.service";

@Module({
  imports: [],
  controllers: [DebatesController],
  providers: [DebatesService],
})
export class DebatesModule {}
