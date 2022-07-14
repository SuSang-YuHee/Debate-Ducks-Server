import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { debate } from "src/events/utils";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { DebateInfo } from "./DebateInfo";
import { UpdateDebateDto } from "./dto/update-debate.dto";
import { DebateEntity } from "./entity/debate.entity";

@Injectable()
export class DebatesService {
  constructor(
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    const update_author = await this.userRepository.findOne({ id: dto.author });
    const update_participant = await this.userRepository.findOne({
      id: dto.participant,
    });

    console.log("UpdateDebate 요청을 받았습니다.");
    console.log("-----------------------------------------------------");
    console.log("update_author : ", update_author);
    console.log("update_participant : ", update_participant);

    await this.debateRepository.update(
      {
        id: dto.id,
      },
      {
        author: update_author,
        title: dto.title,
        contents: dto.contents,
        category: dto.category,
        participant: update_participant,
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
    const create_author = await this.userRepository.findOne({ id: author });
    const debate = new DebateEntity();

    console.log("Debate 저장 요청을 받았습니다.");
    console.log("-----------------------------------------------------");
    console.log("create_author : ", create_author);

    debate.title = title;
    debate.author = create_author;
    debate.author_pros = author_pros;
    debate.category = category;
    debate.contents = contents;
    debate.created_date = new Date();

    console.log("Debate 저장 요청을 받았습니다.");
    console.log("-----------------------------------------------------");
    console.log("create_author : ", create_author);

    await this.debateRepository.save(debate);
  }
}
