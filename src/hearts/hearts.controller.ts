import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { HeartsService } from "./hearts.service";
import { HeartDto } from "./dto/heart.dto";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

@Controller("hearts")
@ApiTags("좋아요 API")
export class HeartsController {
  constructor(private readonly heartsService: HeartsService) {}

  @Post()
  @ApiOperation({
    summary: "좋아요 생성",
    description: "정보를 받아 좋아요를 생성합니다.",
  })
  @ApiCreatedResponse({ description: "좋아요를 성공적으로 생성했을때" })
  @HttpCode(HttpStatus.CREATED)
  async createHeart(@Body() dto: HeartDto): Promise<number> {
    return this.heartsService.createHeart(dto);
  }

  @Get()
  @ApiOperation({
    summary: "좋아요 확인",
    description: "정보를 받아 좋아요를 눌렀는지 아닌지 확인합니다.",
  })
  @ApiOkResponse({ description: "좋아요를 성공적으로 조회한 경우" })
  @HttpCode(HttpStatus.OK)
  async isHeart(@Query() query: HeartDto): Promise<boolean> {
    return this.heartsService.isHeart(query);
  }

  @Delete()
  @ApiOperation({
    summary: "좋아요 취소",
    description: "정보를 받아 좋아요를 취소합니다.",
  })
  @ApiNoContentResponse({
    description: "좋아요를 성공적으로 취소한 경우",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHeart(@Query() dto: HeartDto): Promise<number> {
    return this.heartsService.deleteHeart(dto);
  }
}
