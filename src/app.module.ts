import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    BookingModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoginModule,
  ],
})
export class AppModule {}
