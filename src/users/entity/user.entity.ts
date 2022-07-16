import { DebateEntity } from "src/debates/entity/debate.entity";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { VoteEntity } from "src/votes/entity/vote.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity("User")
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;

  @OneToMany((type) => DebateEntity, (debate) => debate.author)
  debates: DebateEntity[];

  @OneToMany((type) => DebateEntity, (debate) => debate.participant)
  participant_debates: DebateEntity[];

  @OneToMany((type) => FactcheckEntity, (factcheck) => factcheck.target_user)
  factchecks: FactcheckEntity[];

  @OneToMany((type) => VoteEntity, (vote) => vote.target_user)
  votes: VoteEntity[];

  @OneToMany((type) => HeartEntity, (heart) => heart.target_user)
  hearts: HeartEntity[];
}
