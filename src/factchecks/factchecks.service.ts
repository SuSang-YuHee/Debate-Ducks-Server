import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateFactcheckDto } from "./dto/create-factcheck.dto";
import { UpdateFactcheckDto } from "./dto/update-factcheck.dto";
import { FactcheckEntity } from "./entity/factcheck.entity";
import { FactcheckInfo } from "./FactcheckInfo";

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

  async createFactcheck(dto: CreateFactcheckDto) {
    console.log("factcheck-service, create-fc dto : ", dto);
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });
    const factcheck = new FactcheckEntity();

    factcheck.target_user = target_user;
    factcheck.target_debate = target_debate;
    factcheck.pros = dto.pros;
    factcheck.description = dto.description;
    factcheck.reference_url = dto.reference_url;

    await this.factcheckRepository.save(factcheck);
  }

  async deleteFactcheck(factcheckId: number) {
    await this.factcheckRepository.delete({ id: factcheckId });
  }

  async updateFactcheck(dto: UpdateFactcheckDto) {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });

    await this.factcheckRepository.update(
      {
        id: dto.id,
      },
      {
        target_user: target_user,
        target_debate: target_debate,
        pros: dto.pros,
        description: dto.description,
        reference_url: dto.reference_url,
      },
    );
  }

  async getFactcheck(factcheckId: number): Promise<FactcheckInfo> {
    const factcheck = await this.factcheckRepository.findOne({
      id: factcheckId,
    });
    return factcheck;
  }
}