import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaginationService } from "src/pagination/pagination.service";
import { PrismaService } from "src/prisma.service";
import { EnumProductsSort, GetAllProductDto } from "src/product/dto/get-all.products.dto";
import { ProductDto, ProductParamDto } from "src/product/dto/product.dto";
import { returnProducts, returnProductsFull } from "src/product/dto/product.rdo";
import { generateSlug } from "src/utils/generate-slug";

@Injectable()
export class ProductDbService{
    constructor(private prisma: PrismaService, private pagination: PaginationService){}

    async getOne(dto: ProductParamDto){
        const product = await this.prisma.product.findUnique({where: {[dto.id? 'id': 'slug']: dto.id? dto.id: dto.slug}, select: returnProductsFull})
        if(!product) throw new NotFoundException('Product not found!')
        return product
    }

    async getByCategory(categorySlug:string){
        const products = await this.prisma.product.findMany({where: {category: {slug:categorySlug}}, select: returnProductsFull})
        if(!products) throw new NotFoundException('Products not found!')
        return products
    }

    async getSimilar(id: number){
        const dto: ProductParamDto = {id}
        const current = await this.getOne(dto)
        const products = await this.prisma.product.findMany({where: {category: {slug:current.category.slug}, NOT:{id:current.id}},select: returnProducts})
    }

    async create(){
        const product  = await this.prisma.product.create({data:{
            name: '',
            price: 0,
            description: '',
            slug: ''
        }})
        return product
    }

    async update(id: number, dto: ProductDto){
        const category = await this.prisma.category.findUnique({where:{id: dto.categoryId}})
        if (!category) throw new NotFoundException('No such category')
        const product = await this.prisma.product.update({where:{id},data:{
            description: dto.description,
            images: dto.images,
            price: dto.price,
            name: dto.name,
            slug: generateSlug(dto.name),
            category: {connect:{id:dto.categoryId}}
        }})

        return product
    }

    async delete (id:number){
        await this.prisma.product.delete({where:{id}})
    }

    async getAll(dto: GetAllProductDto = {}){
       const {searchItem, sort} = dto

       const prismaSort: Prisma.ProductOrderByWithRelationInput [] = []
       if(sort===EnumProductsSort.HIGH_PRICE){
        prismaSort.push({price:'desc'})
       } 
       else if(sort===EnumProductsSort.LOW_PRICE){
        prismaSort.push({price:'asc'})
       }
       else if (sort===EnumProductsSort.NEWEST){
        prismaSort.push({createdAt:'desc'})
       }
       else if (sort===EnumProductsSort.OLDEST){
        prismaSort.push({createdAt:'asc'})
       }

       const prismaSearchItemFilter: Prisma.ProductWhereInput = searchItem? {
        OR:[
            {category:{name:{contains:searchItem, mode:'insensitive'}}},
            {name:{contains:searchItem, mode:'insensitive'}},
            {description:{contains:searchItem,mode:'insensitive'}}
        ]
       }: {}

       const {perPage, skip} = await this.pagination.getPagination(dto)

       const products = await this.prisma.product.findMany({
         where:prismaSearchItemFilter,
         orderBy: prismaSort,
         skip,
         take:perPage
       })

       return {
        products,
        length: await this.prisma.product.count({where:prismaSearchItemFilter})
       }
    }
}