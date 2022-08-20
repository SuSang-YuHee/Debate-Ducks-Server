import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentEntity } from "./entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<number> {
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

    const comment = new CommentEntity();

    comment.target_user = target_user;
    comment.target_debate = target_debate;
    comment.pros = dto.pros;
    comment.contents = dto.contents;

    await this.commentRepository.save(comment);

    return dto.target_debate_id;
  }

  async updateComment(dto: UpdateCommentDto): Promise<number> {
    const data = await this.commentRepository.findOne({
      where: {
        id: dto.id,
      },
      relations: ["target_debate"],
    });

    const result = data.target_debate.id;

    await this.commentRepository.update(
      { id: dto.id },
      {
        pros: dto.pros,
        contents: dto.contents,
      },
    );

    return result;
  }

  async deleteComment(id: number): Promise<number> {
    if (!id) {
      throw new BadRequestException("삭제 할 id가 옳바르지 않습니다.");
    }

    const data = await this.commentRepository.findOne({
      where: {
        id: id,
      },
      relations: ["target_debate"],
    });

    if (!id) {
      throw new NotFoundException("삭제 할 댓글을 찾지 못했습니다.");
    }

    const result = data.target_debate.id;

    await this.commentRepository.delete({ id: id });

    return result;
  }

  async getCommentsWithUserId(id: string, query: GetCommentsDto) {
    const totalCount = await this.commentRepository.count({
      where: {
        target_user: id,
      },
    });
    const take_flag = query.take || 10;
    const skip_flag = take_flag * (query.page || 0);
    const order_flag = query.order || "ASC";
    const lastPage = Math.ceil(totalCount / take_flag) - 1;
    const last_flag = lastPage <= Number(query.page);
    const result = await this.commentRepository
      .createQueryBuilder("comment")
      .select(["comment.id", "comment.pros", "comment.contents", "debate.id"])
      .leftJoin("comment.target_debate", "debate")
      .where("comment.target_user = :id", { id: id })
      .orderBy("comment.id", order_flag)
      .skip(skip_flag)
      .take(take_flag)
      .getMany();

    return {
      list: result,
      isLast: last_flag,
    };
  }

  async getCommentsWithDebateId(id: number, query: GetCommentsDto) {
    const totalCount = await this.commentRepository.count({
      where: {
        target_debate: id,
      },
    });
    const take_flag = query.take || 10;
    const skip_flag = take_flag * query.page;
    const order_flag = query.order || "ASC";
    const lastPage = Math.ceil(totalCount / take_flag) - 1;
    const last_flag = lastPage <= Number(query.page);
    const result = await this.commentRepository.find({
      where: {
        target_debate: id,
      },
      order: {
        id: order_flag,
      },
      take: take_flag,
      skip: skip_flag,
      relations: ["target_user"],
    });

    return {
      list: result,
      isLast: last_flag,
    };
  }
}
