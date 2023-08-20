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

  async getBookingById(id: string) {
    try {
      const xprisma = await this.prisma.$extends({
        result: {
          booking: {
            isSuccess: {
              needs: { bookingId: true },
              compute(bookingId) {
                if (bookingId) {
                  return true;
                }
              },
            },
          },
        },
      });

      const booking = await xprisma.booking.findUnique({
        where: {
          bookingId: id,
        },
      });

      if (!booking) {
        throw 'Booking not found';
      }

      return booking;
    } catch (e) {
      throw new BadRequestException({
        error: e,
        isSucess: false,
      });
    }
  }
}
