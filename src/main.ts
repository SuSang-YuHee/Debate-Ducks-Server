import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike("DebateDucksServer", {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/",
  });
  const config = new DocumentBuilder()
    .setTitle("Debate Ducks")
    .setDescription("Debate-Ducks-Server-Api")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
