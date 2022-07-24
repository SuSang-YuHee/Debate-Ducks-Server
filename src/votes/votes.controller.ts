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
import { CreateVoteDto } from "./dto/create-vote.dto";
import { IsVotedDto } from "./dto/is-voted.dto";
import { VoteInfo } from "./VoteInfo";
import { VotesService } from "./votes.service";

@Controller("votes")
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  async createVote(@Body() dto: CreateVoteDto): Promise<void> {
    return await this.votesService.createVote(dto);
  }

  @Get("/:id")
  async getVotes(@Param("id") debateId: number) {
    return this.votesService.getVote(debateId);
  }

  @Get()
  async isVoted(@Query() dto: IsVotedDto) {
    return this.votesService.isVoted(dto);
  }

  @Patch()
  async updateVote(@Body() dto: CreateVoteDto): Promise<void> {
    await this.votesService.updateVote(dto);
  }

  @Delete("/:id")
  async deleteVote(@Param("id") voteId: number): Promise<number> {
    return await this.votesService.deleteVote(voteId);
  }
}
