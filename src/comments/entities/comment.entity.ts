import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Comment")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (target_user) => target_user.comments)
  target_user: UserEntity;

  @ManyToOne((type) => DebateEntity, (target_debate) => target_debate.comments)
  target_debate: DebateEntity;

  @Column()
  pros: boolean;

  @Column()
  contents: string;

  @Column()
  created_date: Date;

  @Column()
  updated_date: Date;
}
