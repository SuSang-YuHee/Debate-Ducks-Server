import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { UpdateVoteDto } from "./dto/update-vote.dto";
import { VoteInfo } from "./VoteInfo";
import { VotesService } from "./votes.service";

@Controller("votes")
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  async createVote(@Body() dto: CreateVoteDto): Promise<void> {
    console.log(dto);
    await this.votesService.createVote(dto);
  }

  @Get("/:id")
  async getVote(@Param("id") voteId: number): Promise<VoteInfo> {
    return this.votesService.getVote(voteId);
  }

  @Patch()
  async updateVote(@Body() dto: UpdateVoteDto): Promise<void> {
    await this.votesService.updateVote(dto);
  }

  @Delete("/:id")
  async deleteVote(@Param("id") voteId: number): Promise<void> {
    await this.votesService.deleteVote(voteId);
  }
}
