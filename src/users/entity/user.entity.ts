import { AlarmEntity } from "src/alarms/entities/alarm.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { VoteEntity } from "src/votes/entity/vote.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity("User")
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30, unique: true })
  nickname: string;

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ length: 30, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  profile_image: string;

  @Column({ length: 60, select: false })
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

  @OneToMany((type) => CommentEntity, (comment) => comment.target_user)
  comments: CommentEntity[];

  @OneToMany((type) => AlarmEntity, (alarm) => alarm.receiver)
  alarms: AlarmEntity[];
}
