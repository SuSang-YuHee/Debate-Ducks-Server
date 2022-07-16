import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsModule } from "./events/events.module";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from "@nestjs/typeorm";
import authConfig from "./config/authConfig";
import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import { ExceptionModule } from "./exception/exception.module";
import { LoggingModule } from "./logging/logging.module";
import { HealthCheckController } from "./health-check/health-check.controller";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { DebatesModule } from "./debates/debates.module";
import { FactchecksModule } from "./factchecks/factchecks.module";
import { VotesModule } from "./votes/votes.module";
import { HeartsModule } from './hearts/hearts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike("MyApp", {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRoot(),
    ExceptionModule,
    LoggingModule,
    EventsModule,
    UsersModule,
    EmailModule,
    TerminusModule,
    HttpModule,
    DebatesModule,
    FactchecksModule,
    VotesModule,
    HeartsModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService],
})
export class AppModule {}
