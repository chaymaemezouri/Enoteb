import { Controller, Get, Param } from '@nestjs/common';
import { AdminWriteProtected } from '../auth';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @AdminWriteProtected()
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('projects')
  @AdminWriteProtected()
  listProjects() {
    return this.adminService.listProjects();
  }

  @Get('projects/:id')
  @AdminWriteProtected()
  getProject(@Param('id') id: string) {
    return this.adminService.getProjectById(id);
  }
}
