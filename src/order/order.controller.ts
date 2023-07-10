import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  
  @Auth()
  @Get()
  async getAll(@CurrentUser('id') id: number){
    await this.orderService.getAll(id)
  }
}
