import { Controller, Get, Body, HttpCode, UsePipes, Post, ValidationPipe, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number){
    return this.userService.ById(id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateUser(@CurrentUser('id') id: number,@Body() dto: UserDto){
    return this.userService.updateProfile(id, dto)
  }

  @HttpCode(200)
  @Post('profile/favorites/:productId')
  async toggleFavorite(@CurrentUser('id') id: number, @Param('productId') productId: string){
    return this.userService.toggleFavorite(id, +productId)
  }
}
