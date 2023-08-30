import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, response } from 'express';
import { LoginDTO, SignupDTO } from './types/auth.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Get('state')
  async getLINEState(@Res({ passthrough: true }) response: Response) {
    const { state, jwt } = await this.loginService.generateState(32);

    response.cookie('state', jwt);
    return { state };
  }

  @Post('login')
  async login(
    @Req() request: Request,
    @Body() { state, code }: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookieJwt = request.cookies['state'];

    const { jwt, justCreated } = await this.loginService.login({
      code,
      lineState: state,
      cookieJwt,
    });

    response.clearCookie('state');

    response.cookie('auth', jwt);

    return {
      message: 'ok',
      redirect: `${process.env.FRONTEND_URI}${justCreated ? '/signup' : '/'}`,
    };
  }

  @Post('signup')
  async signup(
    @Req() request: Request,
    @Body() body: SignupDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookieJwt = request.cookies['auth'];

    const user = await this.loginService.signup({ cookieJwt, ...body });

    return { message: 'ok', user };
  }
}
