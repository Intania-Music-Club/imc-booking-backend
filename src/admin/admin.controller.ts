import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch('/confirmbooking/:id')
  confirmBookingById(@Param('id') id: string) {
    return this.adminService.confirmBookingById(id);
  }

  @Patch('/cancelbooking/:id')
  cancelBookingById(@Param('id') id: string) {
    return this.adminService.cancelBookingById(id);
  }

  @Get('/getbookinginfo/:id')
  getBookingById(@Param('id') id: string) {
    return this.adminService.getBookingById(id);
  }
}
