import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { DebateInfo } from "./DebateInfo";
import { DebatesService } from "./debates.service";
import { CreateDebateDto } from "./dto/create-debate.dto";
import { UpdateDebateDto } from "./dto/update-debate.dto";

@Controller("debates")
export class DebatesController {
  constructor(private debatesService: DebatesService) {}

  @Post()
  async createDebate(@Body() dto: CreateDebateDto): Promise<void> {
    console.log(dto);
    const { title, author, author_pros, category, contents } = dto;
    await this.debatesService.createDebate(
      title,
      author,
      author_pros,
      category,
      contents,
    );
  }

  @Get("/:id")
  async getDebateInfo(@Param("id") debateId: number): Promise<DebateInfo> {
    console.log(debateId);
    return this.debatesService.getDebateInfo(debateId);
  }

  @Patch()
  async updateDebateInfo(@Body() dto: UpdateDebateDto): Promise<void> {
    console.log(dto);
    await this.debatesService.updateDebate(dto);
  }

  @Delete("/:id")
  async deleteDebate(@Param("id") debateId: number): Promise<void> {
    console.log(debateId);
    await this.debatesService.deleteDebate(debateId);
  }
}
