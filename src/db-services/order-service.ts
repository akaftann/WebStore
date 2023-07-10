import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class OrderDbService{
    constructor(private prisma: PrismaService){}

    async getAll(id: number){
        const orders =  await this.prisma.order.findMany({where:{userId: id}, orderBy:{createdAt:'desc'}})
        return orders
    }
}