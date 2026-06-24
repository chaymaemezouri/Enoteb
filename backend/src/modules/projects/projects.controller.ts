import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminWriteProtected } from '../auth';
import { AddProjectPhotoDto } from './dto/add-project-photo.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectPhotoDto } from './dto/update-project-photo.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query() query: ListProjectsQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  @AdminWriteProtected()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @AdminWriteProtected()
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @AdminWriteProtected()
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
  }

  @Post(':id/photos')
  @AdminWriteProtected()
  addPhoto(@Param('id') id: string, @Body() dto: AddProjectPhotoDto) {
    return this.projectsService.addPhoto(id, dto);
  }

  @Delete(':id/photos/:photoId')
  @AdminWriteProtected()
  @HttpCode(204)
  async removePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    await this.projectsService.removePhoto(id, photoId);
  }

  @Patch(':id/photos/:photoId')
  @AdminWriteProtected()
  updatePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @Body() dto: UpdateProjectPhotoDto,
  ) {
    return this.projectsService.updatePhoto(id, photoId, dto);
  }
}
