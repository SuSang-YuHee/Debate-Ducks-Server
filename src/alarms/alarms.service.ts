import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateAlarmDto } from "./dto/create-alarm.dto";
import { UpdateAlarmDto } from "./dto/update-alarm.dto";
import { AlarmEntity } from "./entities/alarm.entity";

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(AlarmEntity)
    private alarmRepository: Repository<AlarmEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createAlarm(dto: CreateAlarmDto) {
    const receiver = await this.userRepository.findOne({ id: dto.receiver });
    const alarm = new AlarmEntity();

    alarm.sender = dto.sender;
    alarm.receiver = receiver;
    alarm.contents = dto.contents;
    alarm.target_debate = dto.target_debate;
    alarm.target_comment = dto.target_comment;

    await this.alarmRepository.save(alarm);
  }

  async getAlarm(id: number) {
    const alarm = await this.alarmRepository.findOne({ id: id });
    return alarm;
  }

  async deleteAlarm(id: number) {
    await this.alarmRepository.delete({ id: id });
  }
}
