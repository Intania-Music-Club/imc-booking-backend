import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDTO } from './types/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateState(length: 32) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = '';
    for (let i = 0; i < length; i++) {
      state += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return {
      state,
      jwt: await this.jwtService.signAsync({ state }),
    };
  }

  async login({
    code,
    lineState,
    cookieJwt,
  }: {
    code: string;
    lineState: string;
    cookieJwt: string;
  }) {
    const decoded = await this.jwtService.verifyAsync(cookieJwt);

    if (lineState !== decoded.state) throw new BadRequestException();

    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.FRONTEND_URI}/login`,
        client_id: process.env.LINE_CHANNEL_ID as string,
        client_secret: process.env.LINE_CHANNEL_SECRET as string,
      }).toString(),
    });

    const { id_token } = await tokenRes.json();

    if (!id_token) throw new UnauthorizedException();

    const profileRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id_token,
        client_id: process.env.LINE_CHANNEL_ID as string,
      }),
    });

    const {
      sub: lineUID,
      name: lineDisplayName,
      picture: linePictureUrl,
    } = await profileRes.json();

    const user = await this.prisma.user.upsert({
      where: { lineUserId: lineUID as string },
      update: { profileUrl: linePictureUrl as string },
      create: {
        lineUserId: lineUID as string,
        profileUrl: linePictureUrl as string,
        name: '',
        nickname: '',
        studentId: '',
      },
    });

    return {
      jwt: await this.jwtService.signAsync({
        userId: user.userId,
      }),
      justCreated: user.studentId === '',
    };
  }

  async signup({
    cookieJwt,
    studentId,
    nickname,
    firstName,
    lastName,
  }: SignupDTO & { cookieJwt: string }) {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(cookieJwt);
    } catch (e) {
      throw new UnauthorizedException();
    }

    const userId = decoded.userId;

    // validate user input

    const result = await this.prisma.user.update({
      where: { userId: userId },
      data: {
        studentId,
        nickname,
        name: `${firstName} ${lastName}`,
      },
    });

    return result;
  }
}
