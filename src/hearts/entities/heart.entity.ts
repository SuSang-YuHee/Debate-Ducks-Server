import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Heart")
export class HeartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (target_user) => target_user.hearts)
  target_user: UserEntity;

  @ManyToOne((type) => DebateEntity, (target_debate) => target_debate.hearts)
  target_debate: DebateEntity;
}
