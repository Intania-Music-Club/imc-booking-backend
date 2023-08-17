import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './types/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  createUser(payload: UserDTO) {
    try {
      const user = this.prisma.user.create({
        data: {
          ...payload,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException({
        err: error.message,
      });
    }
  }

  getUserInfoById(id: string) {
    try {
      const user = this.prisma.user.findUnique({
        where: {
          userId: id,
        },
        select: {
          studentId: true,
          nickname: true,
          name: true,
          bookingHistory: {
            select: {
              bookingId: true,
              bookingDate: true,
              bookingTimeIndex: true,
              event: true,
              bandName: true,
            },
          },
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
