import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { GetCommentsResponseDto } from "./dto/get-comments-response.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Controller("comments")
@ApiTags("댓글 API")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({
    summary: "댓글 작성",
    description: "정보를 받아 댓글을 생성합니다.",
  })
  @ApiCreatedResponse({ description: "댓글을 성공적으로 생성" })
  @HttpCode(HttpStatus.CREATED)
  async createComment(@Body() dto: CreateCommentDto): Promise<number> {
    return await this.commentsService.createComment(dto);
  }

  @Get("/user/:id")
  @ApiOperation({
    summary: "댓글 리스트 조회",
    description: "유저 id를 받아 댓글 리스트를 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "댓글 리스트를 조회할 유저의 id",
  })
  @ApiOkResponse({ description: "댓글 리스트를 성공적으로 조회" })
  @HttpCode(HttpStatus.OK)
  async getCommentsWithUserId(
    @Param("id") id: string,
    @Query() query: GetCommentsDto,
  ): Promise<GetCommentsResponseDto> {
    return await this.commentsService.getCommentsWithUserId(id, query);
  }

  @Get("/debate/:id")
  @ApiOperation({
    summary: "댓글 리스트 조회",
    description: "토론 id를 받아 댓글 리스트를 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "댓글 리스트를 조회할 토론의 id.",
  })
  @ApiOkResponse({
    description: "댓글 리스트를 성공적으로 조회",
    type: GetCommentsResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async getCommentsWithDebateId(
    @Param("id") id: number,
    @Query() query: GetCommentsDto,
  ): Promise<GetCommentsResponseDto> {
    return await this.commentsService.getCommentsWithDebateId(id, query);
  }

  @Patch()
  @ApiOperation({
    summary: "댓글 수정",
    description: "댓글을 수정합니다.",
  })
  @ApiOkResponse({ description: "댓글을 성공적으로 수정" })
  @HttpCode(HttpStatus.OK)
  async updateComment(@Body() dto: UpdateCommentDto): Promise<number> {
    return await this.commentsService.updateComment(dto);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "댓글 삭제",
    description: "댓글 id를 받아 댓글을 삭제합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "삭제 할 댓글의 id",
  })
  @ApiNoContentResponse({
    description: "댓글을 성공적으로 삭제",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param("id") id: number): Promise<number> {
    return await this.commentsService.deleteComment(id);
  }
}
