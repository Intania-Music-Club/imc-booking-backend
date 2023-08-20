import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private xprisma = this.prisma.$extends({
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

  async confirmBookingById(id: string) {
    try {
      const booking = await this.xprisma.booking.update({
        where: {
          bookingId: id,
        },
        data: {
          bookingStatus: 'confirm',
        },
      });

      return booking;
    } catch (e) {
      let errMsg = e.meta.cause;

      switch (e.code) {
        case 'P2025': {
          errMsg = 'Booking to update is not found';
        }
      }

      throw new BadRequestException({
        error: errMsg,
        isSucess: false,
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
