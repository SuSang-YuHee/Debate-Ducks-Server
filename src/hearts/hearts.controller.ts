import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { HeartsService } from "./hearts.service";
import { HeartDto } from "./dto/heart.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("hearts")
@ApiTags("좋아요 API")
export class HeartsController {
  constructor(private readonly heartsService: HeartsService) {}

  @Post()
  @ApiOperation({
    summary: "좋아요 생성",
    description: "정보를 받아 좋아요를 생성합니다.",
  })
  async createHeart(@Body() dto: HeartDto): Promise<number> {
    return this.heartsService.createHeart(dto);
  }

  @Get()
  @ApiOperation({
    summary: "좋아요 확인",
    description: "정보를 받아 좋아요를 눌렀는지 아닌지 확인합니다.",
  })
  async isHeart(@Query() query: HeartDto): Promise<boolean> {
    return this.heartsService.isHeart(query);
  }

  @Delete()
  @ApiOperation({
    summary: "좋아요 취소",
    description: "정보를 받아 좋아요를 취소합니다.",
  })
  async deleteHeart(@Query() dto: HeartDto): Promise<number> {
    return this.heartsService.deleteHeart(dto);
  }
}
