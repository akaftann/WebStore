import { Injectable } from '@nestjs/common';
import { CategoryDbService } from 'src/db-services/category-sevice';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto, SearchCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService, private categoryDbService: CategoryDbService){}
    async ById(id: number){
        const dto: SearchCategoryDto = {id: id, slug:''}
        return this.categoryDbService.getOne(dto)
    }

    async BySlug(slug: string){
        const dto: SearchCategoryDto = {slug: slug, id: undefined}
        return this.categoryDbService.getOne(dto)
    }

    async create(){
        return this.categoryDbService.create()
    }

    async update(id: number, dto: CategoryDto){
       const category=  await this.categoryDbService.update(id, dto)
       return(category)
    }

    async delete(id: number){
        return this.categoryDbService.delete(id)
    }
   
    async all(){
        return this.categoryDbService.getAll()
    }
}
