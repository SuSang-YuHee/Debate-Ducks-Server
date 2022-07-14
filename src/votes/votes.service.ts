import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { UpdateVoteDto } from "./dto/update-vote.dto";
import { VoteEntity } from "./entity/vote.entity";
import { VoteInfo } from "./VoteInfo";

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createVote(dto: CreateVoteDto) {
    console.log(dto);
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });
    const vote = new VoteEntity();
    vote.target_user = target_user;
    vote.target_debate = target_debate;
    vote.pros = dto.pros;

    await this.voteRepository.save(vote);
  }

  async getVote(voteId: number): Promise<VoteInfo> {
    const vote = await this.voteRepository.findOne({ id: voteId });
    const vote_obj = {
      id: vote.id,
      pros: vote.pros,
    };
    return vote_obj;
  }

  async updateVote(dto: UpdateVoteDto) {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate,
    });

    await this.voteRepository.update(
      { id: dto.id },
      {
        target_user: target_user,
        target_debate: target_debate,
        pros: dto.pros,
      },
    );
  }

  async deleteVote(voteId: number) {
    await this.voteRepository.delete({ id: voteId });
  }
}
