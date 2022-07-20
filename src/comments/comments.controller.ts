import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() dto: CreateCommentDto) {
    await this.commentsService.createComment(dto);
  }

  @Get("/user/:id")
  async getCommentsWithUserId(
    @Param("id") id: string,
    @Body() order: "ASC" | "DESC",
  ) {
    return await this.commentsService.getCommentsWithUserId(id, order);
  }

  @Get("/debate/:id")
  async getCommentsWithDebateId(
    @Param("id") id: number,
    @Body() order: "ASC" | "DESC",
  ) {
    return await this.commentsService.getCommentsWithDebateId(id, order);
  }
}
