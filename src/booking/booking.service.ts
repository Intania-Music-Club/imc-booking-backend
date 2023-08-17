import { BadRequestException, Injectable } from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDTO } from './types/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(payload: BookingDTO): Promise<Booking> {
    try {
      const booking = this.prisma.booking.create({
        data: {
          bookingDate: new Date(payload.bookingDate),
          bookingTimeIndex: payload.bookingTimeIndex,
          event: payload.event,
          bandName: payload.bandName,
          telephone: payload.telephone,
          bookerId: payload.bookerId,
        },
      });
      return booking;
    } catch (error) {
      throw new BadRequestException({
        err: error.message,
      });
    }
  }
}
