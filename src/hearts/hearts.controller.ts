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
import { CreateHeartDto } from "./dto/create-heart.dto";

@Controller("hearts")
export class HeartsController {
  constructor(private readonly heartsService: HeartsService) {}

  @Post()
  async createHeart(@Body() dto: CreateHeartDto): Promise<number> {
    return this.heartsService.createHeart(dto);
  }

  @Get()
  async isHeart(@Query() query): Promise<boolean> {
    return this.heartsService.isHeart(query);
  }

  @Delete()
  async deleteHeart(@Body() dto: CreateHeartDto): Promise<number> {
    return this.heartsService.deleteHeart(dto);
  }
}
