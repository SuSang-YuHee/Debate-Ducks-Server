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

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() dto: CreateCommentDto) {
    await this.commentsService.createComment(dto);
  }

  @Get("/user/:id")
  async getCommentsWithUserId(@Param("id") id: string, @Query() query) {
    return await this.commentsService.getCommentsWithUserId(id, query);
  }

  @Get("/debate/:id")
  async getCommentsWithDebateId(@Param("id") id: number, @Query() query) {
    return await this.commentsService.getCommentsWithDebateId(id, query);
  }

  @Patch()
  async updateComment(@Body() dto: UpdateCommentDto) {
    await this.commentsService.updateComment(dto);
  }

  @Delete("/:id")
  async deleteComment(@Param("id") id: number) {
    await this.commentsService.deleteComment(id);
  }
}
