import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { DebateInfoResponseDto } from "./dto/debate-info-response.dto";
import { DebatesService } from "./debates.service";
import { CreateDebateDto } from "./dto/create-debate.dto";
import { GetDebatesDto } from "./dto/get-debates-forum.dto";
import { UpdateDebateDto } from "./dto/update-debate.dto";

@Controller("debates")
@ApiTags("토론 API")
export class DebatesController {
  constructor(private debatesService: DebatesService) {}

  @Post()
  @ApiOperation({
    summary: "토론 생성",
    description: "토론 정보를 받아 토론을 작성합니다.",
  })
  @ApiBody({ type: CreateDebateDto })
  @ApiCreatedResponse({ description: "토론을 성공적으로 생성" })
  @HttpCode(HttpStatus.CREATED)
  async createDebate(@Body() dto: CreateDebateDto): Promise<number> {
    const { title, author_id, author_pros, category, contents } = dto;
    return await this.debatesService.createDebate(
      title,
      author_id,
      author_pros,
      category,
      contents,
    );
  }

  @Get("/:id")
  @ApiOperation({
    summary: "토론 조회",
    description: "토론 id를 받아서 해당 토론의 정보를 조회합니다.",
  })
  @ApiOkResponse({
    description: "토론을 성공적으로 조회",
    type: DebateInfoResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async getDebateInfo(
    @Param("id") debateId: number,
  ): Promise<DebateInfoResponseDto> {
    return this.debatesService.getDebateInfo(debateId);
  }

  @Get()
  @ApiOperation({
    summary: "토론 리스트 조회",
    description: "쿼리로 필요한 정보들을 받아 토론 리스트를 반환합니다.",
  })
  @ApiOkResponse({ description: "토론 리스트를 성공적으로 조회" })
  @HttpCode(HttpStatus.OK)
  async getDebates(@Query() dto: GetDebatesDto) {
    return this.debatesService.getDebates(dto);
  }

  @Patch()
  @ApiOperation({
    summary: "토론 업데이트",
    description:
      "업데이트에 필요한 정보들을 받아 토론의 정보를 업데이트 합니다.",
  })
  @ApiOkResponse({ description: "토론을 성공적으로 수정" })
  @HttpCode(HttpStatus.OK)
  async updateDebateInfo(@Body() dto: UpdateDebateDto): Promise<any> {
    return await this.debatesService.updateDebate(dto);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "토론 삭제",
    description: "해당 토론을 삭제합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "삭제할 토론의 id",
  })
  @ApiNoContentResponse({
    description: "토론을 성공적으로 삭제",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDebate(@Param("id") debateId: number): Promise<void> {
    await this.debatesService.deleteDebate(debateId);
  }
}
