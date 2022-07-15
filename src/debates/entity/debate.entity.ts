import { CommentEntity } from "src/comments/entities/comment.entity";
import { FactcheckEntity } from "src/factchecks/entity/factcheck.entity";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { VoteEntity } from "src/votes/entity/vote.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Debate")
export class DebateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (author) => author.debates)
  author: UserEntity;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  contents: string;

  @Column({
    nullable: true,
  })
  video_url: string;

  @ManyToOne(
    (type) => UserEntity,
    (participant) => participant.participant_debates,
  )
  participant: UserEntity;

  @Column()
  author_pros: boolean;

  @Column({
    nullable: true,
  })
  created_date: Date;

  @Column({
    nullable: true,
  })
  updated_date: Date;

  @Column({
    nullable: true,
  })
  ended_date: Date;

  @OneToMany((type) => FactcheckEntity, (factcheck) => factcheck.target_debate)
  factchecks: FactcheckEntity[];

  @OneToMany((type) => VoteEntity, (vote) => vote.target_debate)
  votes: VoteEntity[];

  @OneToMany((type) => HeartEntity, (heart) => heart.target_debate)
  hearts: HeartEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.target_debate)
  comments: CommentEntity[];
}
