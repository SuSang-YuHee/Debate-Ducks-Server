import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { HeartsService } from "./hearts.service";
import { CreateHeartDto } from "./dto/create-heart.dto";

@Controller("hearts")
export class HeartsController {
  constructor(private readonly heartsService: HeartsService) {}

  @Post()
  createHeart(@Body() dto: CreateHeartDto) {
    return this.heartsService.createHeart(dto);
  }

  @Get(":id")
  async getHeart(@Param("id") id: number) {
    return this.heartsService.getHeart(id);
  }

  @Delete(":id")
  async deleteHeart(@Param("id") id: number) {
    return this.heartsService.deleteHeart(id);
  }
}
