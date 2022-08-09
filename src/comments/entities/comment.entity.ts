import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("Comment")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (target_user) => target_user.comments)
  target_user: UserEntity;

  @ManyToOne((type) => DebateEntity, (target_debate) => target_debate.comments)
  target_debate: DebateEntity;

  @Column({
    nullable: true,
  })
  pros: boolean;

  @Column({
    type: "text",
  })
  contents: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
