import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDTO } from './types/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() payload: UserDTO) {
    return this.userService.createUser(payload);
  }

  @Get('/:id')
  getUserInfoById(@Param('id') id: string) {
    return this.userService.getUserInfoById(id);
  }
}
