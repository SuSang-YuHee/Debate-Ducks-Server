import { Module } from "@nestjs/common";
import { AlarmsService } from "./alarms.service";
import { AlarmsController } from "./alarms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlarmEntity } from "./entities/alarm.entity";
import { UserEntity } from "src/users/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity, UserEntity])],
  controllers: [AlarmsController],
  providers: [AlarmsService],
})
export class AlarmsModule {}
