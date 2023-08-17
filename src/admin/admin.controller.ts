import { Controller, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch('/confirmbooking/:id')
  confirmBookingById(@Param('id') id: string) {
    return this.adminService.confirmBookingById(id);
  }
}
