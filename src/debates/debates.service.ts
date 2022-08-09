import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { VoteEntity } from "src/votes/entity/vote.entity";
import { In, Like, Repository } from "typeorm";
import { DebateInfoResponseDto } from "./dto/debate-info-response.dto";
import { GetDebatesDto } from "./dto/get-debates-forum.dto";
import { UpdateDebateDto } from "./dto/update-debate.dto";
import { DebateEntity } from "./entity/debate.entity";

@Injectable()
export class DebatesService {
  constructor(
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(HeartEntity)
    private heartRepository: Repository<HeartEntity>,

    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
  ) {}

  async createDebate(
    title: string,
    author_id: string,
    author_pros: boolean,
    category: string,
    contents: string,
  ) {
    return await this.saveDebate(
      title,
      author_id,
      author_pros,
      category,
      contents,
    );
  }

  async deleteDebate(debateId: number) {
    const debate = await this.debateRepository.findOne({
      where: { id: debateId },
      relations: ["author", "participant"],
    });
    if (!!debate.author && !!debate.participant) {
      throw new BadRequestException(
        "참석자가 이미 참여한 토론은 삭제할 수 없습니다.",
      );
    }
    await this.debateRepository.delete({
      id: debateId,
    });
  }

  async updateDebate(dto: UpdateDebateDto) {
    // TODO 업데이트 일시 분기
    const debate = await this.debateRepository.findOne({
      where: { id: dto.id },
      relations: ["author", "participant"],
    });

    if (!!dto.video_url) {
      return await this.debateRepository.update(
        {
          id: dto.id,
        },
        {
          video_url: dto.video_url,
        },
      );
    }

    if (!!debate.author && !!debate.participant) {
      throw new BadRequestException(
        "참석자가 이미 참여한 토론은 수정할 수 없습니다.",
      );
    }

    if (!dto.participant_id) {
      await this.debateRepository.update(
        {
          id: dto.id,
        },
        {
          title: dto.title,
          contents: dto.contents,
          category: dto.category,
          author_pros: dto.author_pros,
          updated_date: new Date(),
        },
      );
    } else {
      const participant = await this.userRepository.findOne({
        id: dto.participant_id,
      });
      const debate = await this.debateRepository.findOne({
        where: {
          id: dto.id,
        },
        relations: ["author", "participant"],
      });

      if (!debate.participant) {
        if (debate.author.id !== participant.id) {
          const update_participant = await this.userRepository.findOne({
            id: dto.participant_id,
          });

          await this.debateRepository.update(
            {
              id: dto.id,
            },
            {
              participant: update_participant,
            },
          );
        } else {
          throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
        }
      } else {
        // TODO 예외 메세징 처리
        throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
      }
    }
    return dto.id;
  }

  async getDebateInfo(debateId: number): Promise<DebateInfoResponseDto> {
    const prosCnt = await this.voteRepository.count({
      where: {
        pros: true,
        target_debate: debateId,
      },
      relations: ["target_debate"],
    });
    const consCnt = await this.voteRepository.count({
      where: {
        pros: false,
        target_debate: debateId,
      },
      relations: ["target_debate"],
    });
    const debate = await this.debateRepository.findOne({
      where: { id: debateId },
      relations: ["author", "participant", "factchecks"],
    });
    if (!debate) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    } else {
      const result = {
        ...debate,
        vote: { prosCnt: prosCnt, consCnt: consCnt },
      };
      return result;
    }
  }

  async getDebates(dto: GetDebatesDto) {
    const title = decodeURI(dto.title);

    const totalCount = await this.debateRepository.count({
      where: {
        title: Like(`%${title}%`),
      },
    });
    const order_flag = dto.order || "DESC";
    const take_flag = dto.count || 12;
    const skip_flag = take_flag * dto.page;
    const lastPage = Math.ceil(totalCount / take_flag) - 1;
    const last_flag = lastPage <= Number(dto.page);
    const searchDebates = await this.debateRepository.find({
      where: {
        title: Like(`%${dto.title}%`),
      },
      order: {
        id: order_flag,
      },
      take: take_flag,
      skip: skip_flag,
      relations: ["author", "participant"],
    });

    return { list: searchDebates, isLast: last_flag };
  }

  private async saveDebate(
    title: string,
    author_id: string,
    author_pros: boolean,
    category: string,
    contents: string,
  ) {
    const create_author = await this.userRepository.findOne({ id: author_id });
    const debate = new DebateEntity();

    debate.title = title;
    debate.author = create_author;
    debate.author_pros = author_pros;
    debate.category = category;
    debate.contents = contents;
    debate.hearts_cnt = 0;
    debate.created_date = new Date();

    return (await this.debateRepository.save(debate)).id;
  }
}
