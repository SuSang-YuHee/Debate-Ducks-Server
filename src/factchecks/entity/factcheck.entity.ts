import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Factcheck")
export class FactcheckEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserEntity, (target_user) => target_user.factchecks)
  target_user: UserEntity;

  @ManyToOne(
    (type) => DebateEntity,
    (target_debate) => target_debate.factchecks,
  )
  target_debate: DebateEntity;

  @Column()
  pros: boolean;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  reference_url: string;
}
