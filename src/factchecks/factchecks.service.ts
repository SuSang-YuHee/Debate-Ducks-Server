import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateFactcheckDto } from "./dto/create-factcheck.dto";
import { UpdateFactcheckDto } from "./dto/update-factcheck.dto";
import { FactcheckEntity } from "./entity/factcheck.entity";

@Injectable()
export class FactchecksService {
  constructor(
    @InjectRepository(FactcheckEntity)
    private factcheckRepository: Repository<FactcheckEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createFactcheck(dto: CreateFactcheckDto): Promise<number> {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user_id,
    });

    if (!target_user) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate_id,
    });

    if (!target_debate) {
      throw new NotFoundException("해당 토론을 찾지 못했습니다.");
    }

    const factcheck = new FactcheckEntity();

    factcheck.target_user = target_user;
    factcheck.target_debate = target_debate;
    factcheck.pros = dto.pros;
    factcheck.description = dto.description;
    factcheck.reference_url = dto.reference_url;

    await this.factcheckRepository.save(factcheck);
    return dto.target_debate_id;
  }

  async deleteFactcheck(factcheckId: number): Promise<number> {
    if (!factcheckId) {
      throw new BadRequestException(
        "삭제할 팩트체크의 id값이 옳바르게 전달되지 않았습니다.",
      );
    }

    const data = await this.factcheckRepository.findOne({
      where: {
        id: factcheckId,
      },
      relations: ["target_debate"],
    });

    if (!data) {
      throw new NotFoundException("삭제할 팩트체크를 찾지 못했습니다.");
    }

    const result = data.target_debate.id;
    await this.factcheckRepository.delete({ id: factcheckId });
    return result;
  }

  async updateFactcheck(dto: UpdateFactcheckDto): Promise<number> {
    const data = await this.factcheckRepository.findOne({
      where: {
        id: dto.id,
      },
      relations: ["target_debate"],
    });

    if (!data) {
      throw new NotFoundException("업데이트 할 팩트체크를 찾지 못했습니다.");
    }

    const result = data.target_debate.id;
    await this.factcheckRepository.update(
      {
        id: dto.id,
      },
      {
        description: dto.description,
        reference_url: dto.reference_url,
      },
    );
    return result;
  }
}
