import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateFactcheckDto } from "./dto/create-factcheck.dto";
import { UpdateFactcheckDto } from "./dto/update-factcheck.dto";
import { FactchecksService } from "./factchecks.service";

@Controller("factchecks")
@ApiTags("팩트체크 API")
export class FactchecksController {
  constructor(private factchecksService: FactchecksService) {}

  @Post()
  @ApiOperation({
    summary: "팩트체크 생성",
    description: "정보를 받아 팩트체크를 생성합니다.",
  })
  @ApiCreatedResponse({ description: "팩트체크를 성공적으로 생성" })
  @HttpCode(HttpStatus.CREATED)
  async createFactcheck(@Body() dto: CreateFactcheckDto): Promise<number> {
    return await this.factchecksService.createFactcheck(dto);
  }

  @Patch()
  @ApiOperation({
    summary: "팩트체크 업데이트",
    description: "정보를 받아 팩트체크를 수정합니다.",
  })
  @ApiOkResponse({ description: "팩트체크를 성공적으로 조회" })
  @HttpCode(HttpStatus.OK)
  async updateFactcheck(@Body() dto: UpdateFactcheckDto): Promise<number> {
    return await this.factchecksService.updateFactcheck(dto);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "팩트체크 삭제",
    description: "정보를 받아 팩트체크를 삭제합니다.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "삭제할 팩트체크의 id",
  })
  @ApiNoContentResponse({
    description: "팩트체크를 성공적으로 삭제",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFactcheck(@Param("id") factcheckId: number): Promise<number> {
    return await this.factchecksService.deleteFactcheck(factcheckId);
  }
}
