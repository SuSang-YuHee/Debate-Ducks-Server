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

  async createHeart(dto: CreateHeartDto): Promise<number> {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user_id,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate_id,
    });

    const exist = await this.heartRepository.findOne({
      where: {
        target_debate: target_debate,
        target_user: target_user,
      },
      relations: ["target_debate", "target_user"],
    });

    if (!exist) {
      const heart = new HeartEntity();
      heart.target_user = target_user;
      heart.target_debate = target_debate;
      await this.heartRepository.save(heart);
      return dto.target_debate_id;
    } else {
      return dto.target_debate_id;
    }
  }

  async deleteHeart(dto: CreateHeartDto): Promise<number> {
    const heart = await this.heartRepository.findOne({
      where: {
        target_debate: dto.target_debate_id,
        target_user: dto.target_user_id,
      },
      relations: ["target_debate", "target_user"],
    });

    const id = heart.id;
    const result = heart.target_debate.id;

    await this.heartRepository.delete({ id: id });

    return result;
  }

  async isHeart(query: CreateHeartDto) {
    const heart = await this.heartRepository.findOne({
      where: {
        target_user: query.target_user_id,
        target_debate: query.target_debate_id,
      },
    });
    return !!heart;
  }
}
