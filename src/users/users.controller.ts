import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
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
  HttpCode,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { of, switchMap } from "rxjs";
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
import { UpdateUserNicknameDto } from "./dto/update-user-nickname.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UserInfoResponseDto } from "./dto/user-info-response.dto";
import { UsersService } from "./users.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiCreatedResponse,
  ApiOkResponse,
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
  @ApiCreatedResponse({ description: "회원가입을 정상적으로 처리" })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  @ApiOperation({
    summary: "이메일 인증",
    description: "회원가입 중 유저의 이메일을 확인합니다.",
  })
  @ApiOkResponse({ description: "이메일 인증을 정상적으로 처리" })
  @HttpCode(HttpStatus.ACCEPTED)
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  @ApiOperation({
    summary: "유저 로그인",
    description: "유저 정보를 받아 로그인 합니다.",
  })
  @ApiOkResponse({ description: "로그인을 정상적으로 처리" })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

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
  @ApiOkResponse({
    description: "유저 정보를 정상적으로 조회",
    type: UserInfoResponseDto,
  })
  @HttpCode(HttpStatus.OK)
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
  @ApiOkResponse({ description: "작성한 토론을 정상적으로 조회" })
  @HttpCode(HttpStatus.OK)
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
  @ApiOkResponse({ description: "참여한 토론을 정상적으로 조회" })
  @HttpCode(HttpStatus.OK)
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
  @ApiOkResponse({ description: "작성한 댓글을 정상적으로 조회" })
  @HttpCode(HttpStatus.OK)
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
  @ApiOkResponse({ description: "좋아요를 누른 토론을 정상적으로 조회" })
  @HttpCode(HttpStatus.OK)
  async getHeartsDebateByUser(@Param("id") userId: string, @Query() dto) {
    return this.usersService.getHeartsDebateByUser(userId, dto);
  }

  // @UseGuards(AuthGuard)
  @Patch("/:id/nickname")
  @ApiOperation({
    summary: "유저 닉네임 변경",
    description: "유저의 닉네임을 변경합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "변경할 유저의 id",
  })
  @ApiOkResponse({ description: "닉네임 변경을 정상적으로 처리" })
  @HttpCode(HttpStatus.OK)
  async updateNickName(
    @Param("id") userId: string,
    @Body() body: UpdateUserNicknameDto,
  ) {
    await this.usersService.updateNickName(userId, body);
  }

  @Patch("/:id/password")
  @ApiOperation({
    summary: "유저 비밀번호 변경",
    description: "유저의 비밀번호를 변경합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "변경할 유저의 id",
  })
  @ApiOkResponse({ description: "비밀번호 변경을 정상적으로 처리" })
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param("id") userId: string,
    @Body() body: UpdateUserPasswordDto,
  ) {
    await this.usersService.updatePassword(userId, body);
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
  @ApiOkResponse({ description: "프로필 사진을 정상적으로 처리" })
  @HttpCode(HttpStatus.OK)
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

  // @Delete("/:id")
  // @ApiOperation({
  //   summary: "회원탈퇴",
  //   description: "유저 정보를 받아 정보 삭제 처리를 합니다.",
  // })
  // @ApiCreatedResponse({ description: "회원탈퇴를 정상적으로 처리" })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteUser(@Param("id") userId: string): Promise<void> {
  //   await this.usersService.deleteUser(userId);
  // }

  private printLoggerServiceLog(dto) {
    try {
    } catch (e) {
      this.logger.error("error: " + JSON.stringify(dto), e.stack);
    }
    this.logger.log("log: " + JSON.stringify(dto));
  }
}
