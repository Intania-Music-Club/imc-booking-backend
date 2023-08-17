import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BookingDTO {
  @IsString()
  @IsNotEmpty()
  bookingDate: string;

  @IsArray()
  @IsNotEmpty()
  bookingTimeIndex: number[];

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsString()
  @IsNotEmpty()
  bandName: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  bookerId: string;
}
