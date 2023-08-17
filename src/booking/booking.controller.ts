import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './types/booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  createBooking(@Body() payload: BookingDTO) {
    return this.bookingService.createBooking(payload);
  }
}
