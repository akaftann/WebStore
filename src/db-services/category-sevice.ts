import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CategoryDto, SearchCategoryDto } from "src/category/dto/category.dto";
import { returnCategory } from "src/category/dto/category.rdo";
import { PrismaService } from "src/prisma.service";
import { generateSlug } from "src/utils/generate-slug";

@Injectable()
export class CategoryDbService {
    constructor(private readonly prisma: PrismaService){}

    async getOne (dto: SearchCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: {
                [dto.id ? 'id' : 'slug']: dto.id ? dto.id : dto.slug
            },
            select: {
                ...returnCategory
            }
        })
        if(!category) throw new NotFoundException('Category not found')
        return category
    }

    /* async getBySlug (slug: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug: slug
            },
            select: {
                ...returnCategory
            }
        })
        if(!category) throw new BadRequestException('Category not found')
        return category
    } */

    async update(id: number, dto: CategoryDto){
        const updCategory =   await this.prisma.category.update({where:{
            id: id
        },data:{
            name: dto.name,
            slug: generateSlug(dto.name)

        }})
        return updCategory

    }

    async delete(id: number){
        return await this.prisma.category.delete({where:{id}})
    }

    async create(){
        return this.prisma.category.create({data:{
            name: '',
            slug: ''
        }})
    }

    async getAll(){
        return this.prisma.category.findMany({select:{ ...returnCategory}})
    }

    
}