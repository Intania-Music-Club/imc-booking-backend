import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule, BookingModule, AdminModule],
})
export class AppModule {}
