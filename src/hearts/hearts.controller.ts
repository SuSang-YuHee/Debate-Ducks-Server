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
  async createHeart(@Body() dto: CreateHeartDto) {
    return this.heartsService.createHeart(dto);
  }

  @Get()
  async isHeart(@Query() query) {
    return this.heartsService.isHeart(query);
  }

  @Delete(":id")
  async deleteHeart(@Param("id") id: number) {
    return this.heartsService.deleteHeart(id);
  }
}
