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
import { UserInfoResponseDto } from "./dto/user-info-response.dto";
import { UsersService } from "./users.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiHeader,
} from "@nestjs/swagger";

@Controller("users")
@ApiTags("유저 API")
export class UsersController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "유저 회원가입",
    description: "유저 정보를 받아 회원가입 처리를 합니다.",
  })
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printMyLog(dto);
    this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  @ApiOperation({
    summary: "이메일 인증",
    description: "회원가입 중 유저의 이메일을 확인합니다.",
  })
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  @ApiOperation({
    summary: "유저 로그인",
    description: "유저 정보를 받아 로그인 합니다.",
  })
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  // TODD: 카카오 소셜 로그인 구현필요
  // @Post("/oauth/kakao")
  // async kakaoLogin(@Query() dto: UserKakaoLoginDto) {
  //   await this.usersService.kakaoLogin(dto);
  // }
  // @UseGuards(AuthGuard)
  @Get("image")
  @ApiOperation({
    summary: "유저 프로필 사진 조회",
    description: "유저 정보를 받아 프로필 사진을 조회합니다.",
  })
  @ApiQuery({
    name: "user",
    required: true,
    description: "불러올 유저의 id",
  })
  @ApiResponse({
    description: "유저 프로필 사진 조회 성공 시 사진 파일의 이름이 반환됩니다.",
  })
  async getImage(@Query() query): Promise<string> {
    const userId = query.user;
    const imageName = await this.usersService.getImage(userId);
    return imageName;
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: "유저 정보 조회",
    description: "유저 인증 정보를 받아 유저가 가지고 있는 정보를 조회합니다.",
  })
  @ApiHeader({
    name: "Authorization",
    description: "bearer token",
  })
  @ApiResponse({
    type: UserInfoResponseDto,
    description: "유저 정보 조회 성공 시 반환되는 타입",
  })
  async getUserInfo(@Headers() headers: any): Promise<UserInfoResponseDto> {
    const jwtString = headers.authorization.split("Bearer ")[1];

    const userId = this.authService.verify(jwtString).userId;

    return this.usersService.getUserInfo(userId);
  }

  // @UseGuards(AuthGuard)
  @Get("/:id/debates")
  @ApiOperation({
    summary: "유저가 작성한 토론 조회",
    description: "해당 유저가 작성한 토론을 리스트로 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
  async getDebatesByAuthor(
    @Param("id") userId: string,
  ): Promise<DebateEntity[]> {
    return this.usersService.getDebatesByAuthor(userId);
  }

  // @UseGuards(AuthGuard)
  @Get("/:id/participant-debates")
  @ApiOperation({
    summary: "유저가 참여한 토론 조회",
    description: "해당 유저가 참여한 토론을 리스트로 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
  async getDebatesByParticipant(
    @Param("id") userId: string,
  ): Promise<DebateEntity[]> {
    return this.usersService.getDebatesByParticipant(userId);
  }

  // @UseGuards(AuthGuard)
  @Get("/:id/comments")
  @ApiOperation({
    summary: "유저가 작성한 댓글 조회",
    description: "해당 유저가 작성한 댓글을 리스트로 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
  async getCommentsByUser(
    @Param("id") userId: string,
  ): Promise<CommentEntity[]> {
    return this.usersService.getCommentsByUser(userId);
  }

  // @UseGuards(AuthGuard)
  @Get("/:id/hearts")
  @ApiOperation({
    summary: "유저가 좋아요를 누른 토론 리스트 조회",
    description: "해당 유저가 좋아요를 표시한 토론 리스트를 조회합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
  async getHeartsDebateByUser(@Param("id") userId: string, @Query() dto) {
    return this.usersService.getHeartsDebateByUser(userId, dto);
  }

  // @UseGuards(AuthGuard)
  @Patch("/:id")
  @ApiOperation({
    summary: "유저 닉네임 변경",
    description: "유저의 닉네임을 변경합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
  @ApiBody({ type: UpdateUserDto })
  async updateNickName(
    @Param("id") userId: string,
    @Body() body: UpdateUserDto,
  ) {
    await this.usersService.updateNickName(userId, body);
  }

  @Patch("/:id/image")
  @UseInterceptors(FileInterceptor("file", saveImageToStorage))
  @ApiOperation({
    summary: "유저 프로필 사진 등록 및 변경",
    description: "유저의 프로필 사진을 등록하거나 변경합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "조회할 유저의 id",
  })
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
