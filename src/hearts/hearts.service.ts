import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateHeartDto } from "./dto/create-heart.dto";
import { HeartEntity } from "./entities/heart.entity";

@Injectable()
export class HeartsService {
  constructor(
    @InjectRepository(HeartEntity)
    private heartRepository: Repository<HeartEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createHeart(dto: CreateHeartDto) {
    console.log(dto);
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });
    const heart = new HeartEntity();
    heart.target_user = target_user;
    heart.target_debate = target_debate;
    await this.heartRepository.save(heart);
  }

  async getHeart(heartId: number) {
    const heart = await this.heartRepository.findOne({ id: heartId });
    return heart;
  }

  async deleteHeart(id: number) {
    await this.heartRepository.delete({ id: id });
  }
}
