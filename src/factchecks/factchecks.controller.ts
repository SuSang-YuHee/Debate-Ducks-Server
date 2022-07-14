import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateFactcheckDto } from "./dto/create-factcheck.dto";
import { UpdateFactcheckDto } from "./dto/update-factcheck.dto";
import { FactcheckInfo } from "./FactcheckInfo";
import { FactchecksService } from "./factchecks.service";

@Controller("factchecks")
export class FactchecksController {
  constructor(private factchecksService: FactchecksService) {}

  @Post()
  async createFactcheck(@Body() dto: CreateFactcheckDto): Promise<void> {
    console.log(dto);
    await this.factchecksService.createFactcheck(dto);
  }

  @Get("/:id")
  async getFactcheck(@Param("id") factcheckId: number): Promise<FactcheckInfo> {
    console.log(factcheckId);
    return this.factchecksService.getFactcheck(factcheckId);
  }

  @Patch()
  async updateFactcheck(@Body() dto: UpdateFactcheckDto): Promise<void> {
    console.log(dto);
    await this.factchecksService.updateFactcheck(dto);
  }

  @Delete("/:id")
  async deleteFactcheck(@Param("id") factcheckId: number): Promise<void> {
    console.log(factcheckId);
    await this.factchecksService.deleteFactcheck(factcheckId);
  }
}