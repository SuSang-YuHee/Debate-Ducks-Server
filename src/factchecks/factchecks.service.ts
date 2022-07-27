import { Injectable } from "@nestjs/common";
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
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate_id,
    });
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
    const data = await this.factcheckRepository.findOne({
      where: {
        id: factcheckId,
      },
      relations: ["target_debate"],
    });
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
