import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './types/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(payload: UserDTO) {
    try {
      const xprisma = await this.prisma.$extends({
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

    const user = await xprisma.user.create({
      data: {
        ...payload,
      },
    });

      return user;
    } catch (e) {
      throw new BadRequestException({
        error: `${e.meta.target} must be unique`,
        isSucess: false,
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
