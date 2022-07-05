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
import { CreateDebateDto } from "./dto/create-debate.dto";
import { UpdateDebateDto } from "./dto/update-debate.dto";

@Controller("debates")
export class DebatesController {
  @Post()
  async createDebate(@Body() dto: CreateDebateDto): Promise<void> {
    console.log(dto);
  }

  @Get("/:id")
  async getDebateInfo(@Param("id") debateId: number): Promise<DebateInfo> {
    console.log(debateId);
    return;
  }

  @Patch()
  async updateDebateInfo(@Body() dto: UpdateDebateDto): Promise<void> {
    console.log(dto);
  }

  @Delete("/:id")
  async deleteDebate(@Param("id") debateId: number): Promise<void> {
    console.log(debateId);
  }
}
