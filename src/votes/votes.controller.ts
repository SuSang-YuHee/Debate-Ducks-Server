import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { IsVotedDto } from "./dto/is-voted.dto";
import { UpdateVoteDto } from "./dto/update-vote.dto";
import { VotesService } from "./votes.service";

@Controller("votes")
@ApiTags("투표 API")
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  @ApiOperation({
    summary: "투표 생성",
    description: "정보를 받아 투표를 생성합니다.",
  })
  async createVote(@Body() dto: CreateVoteDto): Promise<void> {
    return await this.votesService.createVote(dto);
  }

  @Get("/:id")
  @ApiOperation({
    summary: "찬반 투표수 조회",
    description: "정보를 받아 해당 토론의 투표수를 반환합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "투표수를 조회할 토론의 id",
  })
  async getVoteCount(@Param("id") debateId: number) {
    return this.votesService.getVoteCount(debateId);
  }

  @Get()
  @ApiOperation({
    summary: "투표 여부 조회",
    description:
      "정보를 받아 해당 유저가 해당 토론에 투표를 했는지 반환합니다.",
  })
  async isVoted(@Query() dto: IsVotedDto) {
    return this.votesService.isVoted(dto);
  }

  @Patch()
  @ApiOperation({
    summary: "재투표",
    description:
      "정보를 받아 해당 유저가 해당 토론의 투표를 한 것을 수정합니다.",
  })
  async updateVote(@Body() dto: UpdateVoteDto): Promise<void> {
    await this.votesService.updateVote(dto);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "투표 취소",
    description: "정보를 받아 투표를 제거합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "삭제할 투표의 id",
  })
  async deleteVote(@Param("id") voteId: number): Promise<number> {
    return await this.votesService.deleteVote(voteId);
  }
}
