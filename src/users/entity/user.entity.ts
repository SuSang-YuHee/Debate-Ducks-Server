import { DebateEntity } from "src/debates/entity/debate.entity";
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
}
