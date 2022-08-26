import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { EmailService } from "src/email/email.service";
import { UserInfoResponseDto } from "./dto/user-info-response.dto";
import * as uuid from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, In, Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { ulid } from "ulid";
import { AuthService } from "src/auth/auth.service";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";
import { HeartEntity } from "src/hearts/entities/heart.entity";
import { UpdateUserNicknameDto } from "./dto/update-user-nickname.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(HeartEntity)
    private heartsRepository: Repository<HeartEntity>,
    @InjectRepository(DebateEntity)
    private debatesRepository: Repository<DebateEntity>,
    private connection: Connection,
    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userEmailExist = await this.checkUserEmailExists(email);
    const userNicknameExist = await this.checkUserNicknameExists(name);
    const profile_image = "temp default image";

    if (userEmailExist) {
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다.",
      );
    }

    if (userNicknameExist) {
      throw new UnprocessableEntityException(
        "해당 이름은 이미 사용 중 입니다.",
      );
    }

    const signupVerifyToken = uuid.v1();
    const saltOrRounds = Number(process.env.PASSWORD_SALT);
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    password = hashPassword;

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

  // private async saveUserUsingQueryRunner(
  //   name: string,
  //   email: string,
  //   password: string,
  //   signupVerifyToken: string,
  // ) {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const user = new UserEntity();
  //     user.id = ulid();
  //     user.nickname = name;
  //     user.email = email;
  //     user.password = password;
  //     user.signupVerifyToken = signupVerifyToken;

  //     await queryRunner.manager.save(user);

  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // private async saveUserUsingTransaction(
  //   name: string,
  //   email: string,
  //   password: string,
  //   signupVerifyToken: string,
  // ) {
  //   await this.connection.transaction(async (manager) => {
  //     const user = new UserEntity();
  //     user.id = ulid();
  //     user.nickname = name;
  //     user.email = email;
  //     user.password = password;
  //     user.signupVerifyToken = signupVerifyToken;

  //     await manager.save(user);

  //     // throw new InternalServerErrorException();
  //   });
  // }

  private async checkUserEmailExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });

    return user !== undefined;
  }

  private async checkUserNicknameExists(name: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ nickname: name });

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
    const user = await this.usersRepository.findOne({
      select: ["id", "email", "nickname", "password"],
      where: { email },
    });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException("비밀번호가 일치하지 않습니다.");
    }

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return this.authService.login({
      id: user.id,
      name: user.nickname,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfoResponseDto> {
    const user = await this.usersRepository.findOne({
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

  async updateNickName(userId: string, body: UpdateUserNicknameDto) {
    if (!userId) {
      throw new BadRequestException(
        "userId 값이 옳바르게 넘어오지 않았습니다.",
      );
    }

    const user: UserEntity = new UserEntity();
    user.id = userId;
    user.nickname = body.nickname;
    return this.usersRepository.update(userId, user);
  }

  async updatePassword(userId: string, body: UpdateUserPasswordDto) {
    const user = await this.usersRepository.findOne({
      select: ["password"],
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    const isMatch = await bcrypt.compare(body.prevPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException("이전 비밀번호가 일치하지 않습니다.");
    } else {
      const saltOrRounds = Number(process.env.PASSWORD_SALT);
      const hashPassword = await bcrypt.hash(body.nextPassword, saltOrRounds);

      return await this.usersRepository.update(
        { id: userId },
        { password: hashPassword },
      );
    }
  }

  async uploadImage(userId: string, fileName: string) {
    const user: UserEntity = new UserEntity();
    user.id = userId;
    user.profile_image = fileName;
    return this.usersRepository.update(userId, user);
  }

  async getImage(userId: string): Promise<string> {
    const userEntity = await this.usersRepository.findOne({
      select: ["profile_image"],
      where: {
        id: userId,
      },
    });

    if (!userEntity) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    const profileImage = userEntity.profile_image;

    if (!profileImage) {
      throw new NotFoundException("프로필 사진 정보를 찾을 수 없습니다.");
    }

    return profileImage;
  }

  async getDebatesByAuthor(userId: string): Promise<DebateEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["debates"],
    });

    if (!author) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    return author.debates;
  }

  async getDebatesByParticipant(userId: string): Promise<DebateEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["participant_debates"],
    });

    if (!author) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    return author.participant_debates;
  }

  async getCommentsByUser(userId: string): Promise<CommentEntity[]> {
    const author = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["comments"],
    });

    if (!author) {
      throw new NotFoundException("해당 유저를 찾지 못했습니다.");
    }

    return author.comments;
  }

  async getHeartsDebateByUser(userId: string, dto) {
    const order_flag = dto.order || "DESC";
    const take_flag = dto.count || 12;
    const skip_flag = take_flag * Number(dto.page);
    const result = await this.heartsRepository
      .createQueryBuilder("heart")
      .select(["heart", "d.id"])
      .leftJoin("heart.target_debate", "d")
      .where("heart.target_user = :id", { id: userId })
      .getMany();

    let newArr = [];
    result.map((data) => {
      newArr.push(data.target_debate.id);
    });

    const totalCount = newArr.length;
    const lastPage = Math.ceil(totalCount / take_flag) - 1;
    const last_flag = lastPage <= Number(dto.page);

    const debates = await this.debatesRepository.find({
      where: {
        id: In(newArr),
      },
      order: {
        id: order_flag,
      },
      take: take_flag,
      skip: skip_flag,
      relations: ["author", "participant"],
    });

    return {
      list: debates,
      isLast: last_flag,
    };
  }
}
