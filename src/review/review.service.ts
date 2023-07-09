import { Injectable } from '@nestjs/common';
import { ReviewDbService } from 'src/db-services/review-sevice';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
    constructor(private reviewDbService: ReviewDbService){}

    async create(productId:number, dto: ReviewDto, userId: number){
        return this.reviewDbService.create(userId, dto, productId)
    }

   
    async all(){
        return this.reviewDbService.getAll()
    }

    async getAverage(productId: number){
        return this.reviewDbService.getAverageValueByProduct(productId)
    }
}
