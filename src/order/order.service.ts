import { Injectable } from '@nestjs/common';
import { OrderDbService } from 'src/db-services/order-service';

@Injectable()
export class OrderService {
    constructor(private orderService: OrderDbService){}
    async getAll(userId: number){
        const orders =  await this.orderService.getAll(userId)
        return orders
    }
}
