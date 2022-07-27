import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Vote")
export class VoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (target_user) => target_user.votes)
  target_user: UserEntity;

  @ManyToOne((type) => DebateEntity, (target_debate) => target_debate.votes)
  target_debate: DebateEntity;

  @Column()
  pros: boolean;
}
