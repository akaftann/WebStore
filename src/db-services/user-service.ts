import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthDto } from "../auth/dto/auth.dto";
import { faker } from '@faker-js/faker';
import { hash} from "argon2";
import { UserDto } from "src/user/dto/user.dto";
import { profileObject } from "src/user/dto/profile.rdo";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async getById (id: number) {
        const user = await this.prisma.user.findUnique({where:{id: id}})
        if(!user) throw new NotFoundException('There is no such user')
        return user
    }

    async getProfile(id:number, selectObject: Prisma.UserSelect = {}){
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                ...profileObject,
                favorites: {
                    select:{
                        productId: true,
                        favorites:{
                        select:{
                            name: true,
                            price: true,
                            images: true,
                            slug: true
                        }
                       } 
                    }
                },
                ...selectObject
            }
        })
        if(!user) throw new BadRequestException('User not found')

        return user
    }

    async getByEmail (email: string) {
        const user = await this.prisma.user.findUnique({where:{email: email}})
        if(!user) throw new BadRequestException('There is no such user')
        return user
    }

    async create(dto: AuthDto){
        const existedUser = await this.prisma.user.findUnique({where:{email: dto.email}})

        if(existedUser) throw new BadRequestException('User already exists')

        const user = await this.prisma.user.create({data:{
            email: dto.email,
            name: faker.person.firstName(),
            phone: faker.phone.number('+38 (0##) ###-##-##'),
            avatarPath: faker.image.avatar(),
            password: await hash(dto.password) 
        }})
        return user
    }

    async update(dto: UserDto, id:number, password: string = ''){
        const updatedUser = await this.prisma.user.update({where:{
            id
        },data:{
            email: dto.email,
            name: dto.name,
            avatarPath: dto.avatarPath,
            phone: dto.phone,
            password: dto.password? await hash(dto.password) : password
        }})
        return updatedUser
    }


    async updateFavorites(id:number, productId: number, isExists: boolean){
        await this.prisma.$transaction(async(prisma)=>{
            if(!isExists){
                await this.prisma.products_on_user.create({data:{userId: id, productId: productId}})
            }else{
                await this.prisma.products_on_user.delete({where:{userId_productId: {userId:id, productId: productId}}})
            }
        })
    }

    async getStatistics(id: number){
        
        return this.prisma.$queryRaw`SELECT 
                                    u.id, 
                                    COUNT(r.id) AS reviewCount, 
                                    COUNT(o.id) AS orderCount, 
                                    SUM(oi.price) AS totalOrderPrice,
                                    (SELECT COUNT(f.product_id) as favoritescnt FROM "Products_on_user" as f WHERE f.user_id = ${id})
                                        FROM "User" AS u
                                        LEFT JOIN "Review" AS r ON u.id = r.user_id
                                        LEFT JOIN "Order" AS o ON u.id = o.user_id
                                        LEFT JOIN "Order_item" AS oi ON oi.order_id = o.id
                                        WHERE u.id = ${id}
                                        GROUP BY u.id;`

    }
}