import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("Debate")
export class DebateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  contents: string;

  @Column()
  video_url: string;

  @Column()
  participant: string;

  @Column()
  author_pros: boolean;

  @Column()
  created_date: Date;

  @Column()
  updated_date: Date;

  @Column()
  ended_date: Date;
}
