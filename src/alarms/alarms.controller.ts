import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AlarmsService } from "./alarms.service";
import { CreateAlarmDto } from "./dto/create-alarm.dto";

@Controller("alarms")
@ApiTags("알람 API")
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Post()
  async createAlarm(@Body() dto: CreateAlarmDto) {
    return this.alarmsService.createAlarm(dto);
  }

  @Get("/:id")
  async getAlarm(@Param("id") alarmId: number) {
    return this.alarmsService.getAlarm(alarmId);
  }

  @Delete("/id")
  async deleteAlarm(@Param("id") alarmId: number) {
    await this.alarmsService.deleteAlarm(alarmId);
  }
}
