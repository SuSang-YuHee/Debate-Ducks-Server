import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
  LoggerService,
  Logger,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Request,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { join } from "path";
import { Observable, of, switchMap } from "rxjs";
import { AuthGuard } from "src/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { CommentEntity } from "src/comments/entities/comment.entity";
import { DebateEntity } from "src/debates/entity/debate.entity";
import {
  isFileExtensitonSafe,
  removeFile,
  saveImageToStorage,
} from "src/utils/image-storage";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UserInfo } from "./UserInfo";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printMyLog(dto);
    this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  // TODD: 카카오 소셜 로그인 구현필요
  // @Post("/oauth/kakao")
  // async kakaoLogin() {}

  @Get("image")
  getImage(@Query() query, @Res() res): Observable<Object> {
    const userId = query.user;
    return this.usersService.getImage(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: "./uploads" }));
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async getUserInfo(
    @Headers() headers: any,
    @Param("id") userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split("Bearer ")[1];

    this.authService.verify(jwtString);

    return this.usersService.getUserInfo(userId);
  }

  @Get("/:id/debates")
  async getDebatesByAuthor(
    @Param("id") userId: string,
  ): Promise<DebateEntity[]> {
    return this.usersService.getDebatesByAuthor(userId);
  }

  @Get("/:id/participant-debates")
  async getDebatesByParticipant(
    @Param("id") userId: string,
  ): Promise<DebateEntity[]> {
    return this.usersService.getDebatesByParticipant(userId);
  }

  @Get("/:id/comments")
  async getCommentsByUser(
    @Param("id") userId: string,
  ): Promise<CommentEntity[]> {
    return this.usersService.getCommentsByUser(userId);
  }

  @Patch("/:id")
  async updateNickName(@Param("id") userId: string, @Body() body) {
    await this.usersService.updateNickName(userId, body);
  }

  @Patch("/:id/upload")
  @UseInterceptors(FileInterceptor("file", saveImageToStorage))
  async uploadFile(
    @Param("id") user_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = file?.filename;

    if (!fileName) {
      throw new HttpException(
        "File must be a png, jpg/jpeg",
        HttpStatus.BAD_REQUEST,
      );
    }

    const imagesFolderPath = join(process.cwd(), "uploads");
    const fullImagePath = join(imagesFolderPath + "/" + file.filename);

    return isFileExtensitonSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = user_id;
          return this.usersService.uploadImage(userId, fileName);
        }
        removeFile(fullImagePath);
        return of({ error: "File content does not match extension!" });
      }),
    );
  }

  // private printMyLog(dto) {
  //   console.log(this.logger.name);

  //   this.logger.error("error: ", dto);
  //   this.logger.warn("warn: ", dto);
  //   this.logger.info("info: ", dto);
  //   this.logger.http("http: ", dto);
  //   this.logger.verbose("verbose: ", dto);
  //   this.logger.debug("debug: ", dto);
  //   this.logger.silly("silly: ", dto);
  // }

  private printLoggerServiceLog(dto) {
    try {
      // throw new InternalServerErrorException("For test");
    } catch (e) {
      this.logger.error("error: " + JSON.stringify(dto), e.stack);
    }
    this.logger.warn("warn: " + JSON.stringify(dto));
    this.logger.log("log: " + JSON.stringify(dto));
    this.logger.verbose("verbose: " + JSON.stringify(dto));
    this.logger.debug("debug: " + JSON.stringify(dto));
  }
}
