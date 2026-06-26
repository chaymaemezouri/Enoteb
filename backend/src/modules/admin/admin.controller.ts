import { Controller, Delete, Get, HttpCode, Param, Patch, Query } from '@nestjs/common';
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

  @Get('contact-requests')
  @AdminWriteProtected()
  listContactRequests(@Query('filter') filter?: string) {
    const normalized = filter === 'unread' ? 'unread' : 'all';
    return this.adminService.listContactRequests(normalized);
  }

  @Get('contact-requests/:id')
  @AdminWriteProtected()
  getContactRequest(@Param('id') id: string) {
    return this.adminService.getContactRequestById(id);
  }

  @Patch('contact-requests/:id/read')
  @AdminWriteProtected()
  markContactRequestRead(
    @Param('id') id: string,
    @Query('value') value?: string,
  ) {
    const isRead = value !== 'false';
    return this.adminService.markContactRequestRead(id, isRead);
  }

  @Delete('contact-requests/:id')
  @HttpCode(204)
  @AdminWriteProtected()
  deleteContactRequest(@Param('id') id: string) {
    return this.adminService.deleteContactRequest(id);
  }
}
