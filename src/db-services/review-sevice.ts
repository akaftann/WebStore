import { Injectable, NotFoundException } from "@nestjs/common";
import { ReviewDto } from "src/review/dto/review.dto";
import { returnReview } from "src/review/dto/review.rdo";
import { PrismaService } from "src/prisma.service";


@Injectable()
export class ReviewDbService {
    constructor(private readonly prisma: PrismaService){}


    async getAverageValueByProduct(productId: number){   
        return this.prisma.review.aggregate({where:{productId}, _avg:{rating: true}}).then(data=>data._avg)
    }

    async create(productId: number, dto: ReviewDto, userId: number){
        const product = await this.prisma.product.findUnique({where:{id:productId}})
        if(!product) throw new NotFoundException('No such product')
        return this.prisma.review.create({data:{
            ...dto,
            product:{connect:{id: productId}},
            user:{connect:{id:userId}}
        }})
    }

    async getAll(){
        return this.prisma.review.findMany({orderBy: {createdAt: 'desc'},
            select:{ ...returnReview}})
    }

    
}