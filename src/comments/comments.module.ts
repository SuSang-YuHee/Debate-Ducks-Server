import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { DebateEntity } from "src/debates/entity/debate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, DebateEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
