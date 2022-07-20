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
import { FactchecksService } from "./factchecks.service";

@Controller("factchecks")
export class FactchecksController {
  constructor(private factchecksService: FactchecksService) {}

  @Post()
  async createFactcheck(@Body() dto: CreateFactcheckDto): Promise<number> {
    console.log(dto);
    return await this.factchecksService.createFactcheck(dto);
  }

  @Patch()
  async updateFactcheck(@Body() dto: UpdateFactcheckDto): Promise<number> {
    console.log(dto);
    return await this.factchecksService.updateFactcheck(dto);
  }

  @Delete("/:id")
  async deleteFactcheck(@Param("id") factcheckId: number): Promise<number> {
    console.log(factcheckId);
    return await this.factchecksService.deleteFactcheck(factcheckId);
  }
}
