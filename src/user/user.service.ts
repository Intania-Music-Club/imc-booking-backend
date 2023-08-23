import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './types/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  xprisma = this.prisma.$extends({
    result: {
      user: {
        isSuccess: {
          needs: { userId: true },
          compute(userId) {
            if (userId) {
              return true;
            } else {
              return false;
            }
          },
        },
      },
    },
  });

  async createUser(payload: UserDTO) {
    try {
      const user = await this.xprisma.user.create({
        data: {
          ...payload,
        },
      });

      return user;
    } catch (e) {
      throw new BadRequestException({
        err: e,
        isSuccess: false,
      });
    }
  }

  async getUserInfoById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          userId: id,
        },
        select: {
          userId: true,
          profileUrl: true,
          studentId: true,
          nickname: true,
          name: true,
          bookingHistory: {
            select: {
              bookingDate: true,
              bookingTimeIndex: true,
              event: true,
              bandName: true,
            },
          },
        },
      });

      return user;
    } catch (e) {
      throw new BadRequestException({
        err: e,
        isSuccess: false,
      });
    }
  }
}
