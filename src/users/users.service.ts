import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { UserInfoDto } from "./dto/user-info.dto";
import * as uuid from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { ulid } from "ulid";
import { AuthService } from "src/auth/auth.service";
import { from, map, Observable } from "rxjs";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private connection: Connection,
    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    const profile_image = "temp default image";
    if (userExist) {
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다.",
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(
      name,
      email,
      password,
      profile_image,
      signupVerifyToken,
    );
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    profile_image: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.nickname = name;
    user.email = email;
    user.password = password;
    user.profile_image = profile_image;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.nickname = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // async kakaoLogin(dto: UserKakaoLoginDto) {
  //   const authorizationCode = dto.authorizationCode;
  //   const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  //   const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  //   const grantType = "authorization_code";

  //   if (authorizationCode) {
  //     const response = await axios({
  //       method: "POST",
  //       url: `https://kauth.kakao.com/oauth/token?code=${authorizationCode}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&grant_type=${grantType}`,
  //       headers: {
  //         "Content-type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     const { access_token } = response.data;

  //     const kakaoUserInfo = await axios({
  //       method: "GET",
  //       url: "https://kapi.kakao.com/v2/user/me",
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         "Content-type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     const { email, profile } = kakaoUserInfo.data.kakao_account;
  //     const userInfo = await models.user.findOne({ where: { email } });

  //     if (!userInfo) {
  //       const newUserInfo = await models.user.create({
  //         email: email,
  //         name: profile.nickname,
  //         profile: profile.profile_image_url,
  //         // created_at: Date.now(),
  //         sign_method: "kakao",
  //       });

  //       const accessToken = generateAccessToken(
  //         JSON.stringify({
  //           newUserInfo,
  //         }),
  //       );

  //       console.log("accessToken : ", accessToken);

  //       sendAccessToken(
  //         res,
  //         {
  //           id: newUserInfo.dataValues.id,
  //           email: newUserInfo.dataValues.email,
  //           name: newUserInfo.dataValues.name,
  //           profile: newUserInfo.dataValues.profile,
  //           sign_method: newUserInfo.dataValues.sign_method,
  //         },
  //         accessToken,
  //       );
  //     } else {
  //       const accessToken = generateAccessToken(
  //         JSON.stringify({
  //           userInfo,
  //         }),
  //       );
  //       console.log("accessToken : ", accessToken);
  //       sendAccessToken(
  //         res,
  //         {
  //           id: userInfo.dataValues.id,
  //           email: userInfo.dataValues.email,
  //           name: userInfo.dataValues.name,
  //           profile: userInfo.dataValues.profile,
  //           sign_method: userInfo.dataValues.sign_method,
  //         },
  //         accessToken,
  //       );
  //     }

  // }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.nickname = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    });
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });

    return user !== undefined;
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ signupVerifyToken });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return this.authService.login({
      id: user.id,
      name: user.nickname,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email, password });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return this.authService.login({
      id: user.id,
      name: user.nickname,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfoDto> {
    const user = await this.usersRepository.findOne({
      select: ["id", "nickname", "email"],
      where: { id: userId },
      relations: ["debates", "participant_debates", "comments"],
    });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      profile_image: user.profile_image,
    };
  }

  async updateNickName(userId: string, body) {
    const user: UserEntity = new UserEntity();
    user.id = userId;
    user.nickname = body.nickname;
    from(this.usersRepository.update(userId, user));
  }

  async uploadImage(userId: string, fileName: string) {
    const user: UserEntity = new UserEntity();
    user.id = userId;
    user.profile_image = fileName;
    return from(this.usersRepository.update(userId, user));
  }

  getImage(userId: string): Observable<string> {
    return from(this.usersRepository.findOne({ id: userId })).pipe(
      map((user) => {
        return user.profile_image;
      }),
    );
  }

  async getDebatesByAuthor(userId: string): Promise<DebateEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["debates"],
    });
    return author.debates;
  }

  async getDebatesByParticipant(userId: string): Promise<DebateEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["participant_debates"],
    });
    return author.participant_debates;
  }

  async getCommentsByUser(userId: string): Promise<CommentEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["comments"],
    });
    return author.comments;
  }
}
