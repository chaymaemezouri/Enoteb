import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminWriteProtected } from '../auth';
import { CreateSectorDto } from './dto/create-sector.dto';
import { SectorProjectsQueryDto } from './dto/sector-projects-query.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorsService } from './sectors.service';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Get()
  findAll() {
    return this.sectorsService.findAll();
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query() query: SectorProjectsQueryDto,
  ) {
    return this.sectorsService.findBySlugWithProjects(slug, query);
  }

  @Post()
  @AdminWriteProtected()
  create(@Body() dto: CreateSectorDto) {
    return this.sectorsService.create(dto);
  }

  @Patch(':id')
  @AdminWriteProtected()
  update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
    return this.sectorsService.update(id, dto);
  }

  @Delete(':id')
  @AdminWriteProtected()
  remove(@Param('id') id: string) {
    return this.sectorsService.remove(id);
  }
}
