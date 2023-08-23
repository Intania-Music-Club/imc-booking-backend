import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  confirmBookingById(id: string) {
    try {
      const user = this.prisma.booking.update({
        where: {
          bookingId: id,
        },
        data: {
          bookingStatus: 'confirm',
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException({
        err: error.message,
      });
    }
  }

  cancelBookingById(id: string) {
    try {
      const user = this.prisma.booking.update({
        where: {
          bookingId: id,
        },
        data: {
          bookingStatus: 'cancel',
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException({
        err: error.message,
      });
    }
  }
}
