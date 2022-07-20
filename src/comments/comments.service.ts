import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
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

  async createComment(dto: CreateCommentDto) {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });
    const comment = new CommentEntity();

    comment.target_user = target_user;
    comment.target_debate = target_debate;
    comment.pros = dto.pros;
    comment.contents = dto.contents;

    await this.commentRepository.save(comment);
  }

  async updateComment(dto: UpdateCommentDto) {
    await this.commentRepository.update(
      { id: dto.id },
      {
        pros: dto.pros,
        contents: dto.contents,
      },
    );
  }

  async deleteComment(id: number) {
    await this.commentRepository.delete({ id: id });
  }

  async getComment(id: number) {
    const comment = await this.commentRepository.findOne({ id: id });
    return comment;
  }

  async getCommentsWithUserId(id: string, query) {
    const take_flag = 10;
    const skip_flag = take_flag * query.page;
    const order_flag = query.order;
    const result = await this.commentRepository.find({
      where: {
        target_user: id,
      },
      order: {
        id: order_flag,
      },
      take: take_flag,
      skip: skip_flag,
      relations: ["target_user", "target_debate"],
    });

    return result;
  }

  async getCommentsWithDebateId(id: number, query) {
    const take_flag = 10;
    const skip_flag = take_flag * query.page;
    const order_flag = query.order;
    const result = await this.commentRepository.find({
      where: {
        target_debate: id,
      },
      order: {
        id: order_flag,
      },
      take: take_flag,
      skip: skip_flag,
      relations: ["target_user", "target_debate"],
    });

    return result;
  }
}
