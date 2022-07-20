import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentEntity } from "./entities/comment.entity";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() dto: CreateCommentDto): Promise<number> {
    return await this.commentsService.createComment(dto);
  }

  @Get("/user/:id")
  async getCommentsWithUserId(
    @Param("id") id: string,
    @Query() query,
  ): Promise<CommentEntity[]> {
    return await this.commentsService.getCommentsWithUserId(id, query);
  }

  @Get("/debate/:id")
  async getCommentsWithDebateId(
    @Param("id") id: number,
    @Query() query,
  ): Promise<CommentEntity[]> {
    return await this.commentsService.getCommentsWithDebateId(id, query);
  }

  @Patch()
  async updateComment(@Body() dto: UpdateCommentDto): Promise<number> {
    return await this.commentsService.updateComment(dto);
  }

  @Delete("/:id")
  async deleteComment(@Param("id") id: number): Promise<number> {
    return await this.commentsService.deleteComment(id);
  }
}
