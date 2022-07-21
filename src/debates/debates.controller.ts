import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Response } from "express";
import { DebateInfo } from "./DebateInfo";
import { DebatesService } from "./debates.service";
import { CreateDebateDto } from "./dto/create-debate.dto";
import { GetDebatesDto } from "./dto/get-debates-forum.dto";
import { SearchDebatesDto } from "./dto/search-debates-forum.dto";
import { UpdateDebateDto } from "./dto/update-debate.dto";

@Controller("debates")
export class DebatesController {
  constructor(private debatesService: DebatesService) {}

  @Post()
  async createDebate(@Body() dto: CreateDebateDto): Promise<number> {
    const { title, author_id, author_pros, category, contents } = dto;
    return await this.debatesService.createDebate(
      title,
      author_id,
      author_pros,
      category,
      contents,
    );
  }

  @Get("/search")
  async searchDebates(@Body() dto: SearchDebatesDto) {
    console.log("title : ", dto.title);
    return this.debatesService.searchDebates(dto);
  }

  @Get("/:id")
  async getDebateInfo(
    @Param("id") debateId: number,
    @Query() query,
  ): Promise<DebateInfo | string> {
    return this.debatesService.getDebateInfo(debateId, query);
  }

  @Get()
  async getDebates(@Body() dto: GetDebatesDto) {
    return this.debatesService.getDebates(dto);
  }

  @Patch()
  async updateDebateInfo(@Body() dto: UpdateDebateDto): Promise<any> {
    return await this.debatesService.updateDebate(dto);
  }

  @Delete("/:id")
  async deleteDebate(@Param("id") debateId: number): Promise<void> {
    console.log(debateId);
    await this.debatesService.deleteDebate(debateId);
  }
}
