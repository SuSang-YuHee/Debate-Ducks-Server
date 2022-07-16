import { UserEntity } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alarm")
export class AlarmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @ManyToOne((type) => UserEntity, (receiver) => receiver.alarms)
  receiver: UserEntity;

  @Column()
  contents: string;

  @Column()
  target_debate: number;

  @Column()
  target_comment: number;
}
