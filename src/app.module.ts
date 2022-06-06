import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsModule } from "./events/events.module";
import { UsersController } from './users/users.controller';

@Module({
  imports: [EventsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
