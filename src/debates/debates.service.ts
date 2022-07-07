import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { debate } from "src/events/utils";
import { Repository } from "typeorm";
import { DebateInfo } from "./DebateInfo";
import { UpdateDebateDto } from "./dto/update-debate.dto";
import { DebateEntity } from "./entity/debate.entity";

@Injectable()
export class DebatesService {
  constructor(
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createDebate(
    title: string,
    author: string,
    author_pros: boolean,
    category: string,
    contents: string,
  ) {
    await this.saveDebate(title, author, author_pros, category, contents);
  }

  async deleteDebate(debateId: number) {
    await this.debateRepository.delete({
      id: debateId,
    });
  }

  async updateDebate(dto: UpdateDebateDto) {
    await this.debateRepository.update(
      {
        id: dto.id,
      },
      {
        author: dto.author,
        title: dto.title,
        contents: dto.contents,
        category: dto.category,
        participant: dto.participant,
        video_url: dto.video_url,
        author_pros: dto.author_pros,
        updated_date: new Date(),
        ended_date: dto.ended_date,
      },
    );
  }

  async getDebateInfo(debateId: number): Promise<DebateInfo> {
    const debate = await this.debateRepository.findOne({ id: debateId });

    return debate;
  }

  private async saveDebate(
    title: string,
    author: string,
    author_pros: boolean,
    category: string,
    contents: string,
  ) {
    const debate = new DebateEntity();
    debate.title = title;
    debate.author = author;
    debate.author_pros = author_pros;
    debate.category = category;
    debate.contents = contents;
    debate.created_date = new Date();
    await this.debateRepository.save(debate);
  }
}
