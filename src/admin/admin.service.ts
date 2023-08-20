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
          errMsg = 'Booking to confirm is not found';
        }
      }

      throw new BadRequestException({
        error: errMsg,
        isSucess: false,
      });
    }
  }

  async cancelBookingById(id: string) {
    try {
      const booking = await this.xprisma.booking.update({
        where: {
          bookingId: id,
        },
        data: {
          bookingStatus: 'cancel',
        },
      });

      return booking;
    } catch (e) {
      let errMsg = e.meta.cause;

      switch (e.code) {
        case 'P2025': {
          errMsg = 'Booking to cancel is not found';
        }
      }

      throw new BadRequestException({
        error: errMsg,
        isSucess: false,
      });
    }
  }

  async getBookingById(id: string) {
    try {
      const booking = await this.xprisma.booking.findUnique({
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
