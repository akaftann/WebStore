import { Injectable } from '@nestjs/common';
import { ProductDbService } from 'src/db-services/product-service';
import { ProductDto, ProductParamDto } from './dto/product.dto';
import { GetAllProductDto } from './dto/get-all.products.dto';
import { asyncScheduler } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(private productService: ProductDbService){}

    async byId(id: number){
        const dto: ProductParamDto = {id}
        return await this.productService.getOne(dto)
    }

    async bySlug(slug: string){
        const dto: ProductParamDto = {slug}
        return await this.productService.getOne(dto)
    }

    async getByCategory(categorySlug: string){
        return await this.productService.getByCategory(categorySlug)
    }

    async getSimilar(productId: number){
        return await this.productService.getSimilar(productId)
    }

    async delete(productId: number){
        return await this.productService.delete(productId)
    }

    async create(){
        return await this.productService.create()
    }

    async updateProduct(productId: number, dto: ProductDto){
        return await this.productService.update(productId, dto)
    }

    async getAll(dto: GetAllProductDto={}){
        return await this.productService.getAll(dto)
    }
}
