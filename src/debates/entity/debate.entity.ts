import { UserEntity } from "src/users/entity/user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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
}
