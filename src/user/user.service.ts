import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { profileObject } from './dto/profile.dto';
import { Prisma } from '@prisma/client';
import { UserService as UService } from 'src/db-services/user-service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private userService: UService){}

    async ById(id: number, selectObject: Prisma.UserSelect = {}){
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                ...profileObject,
                favorites: {
                    select:{
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        slug: true
                    }
                },
                ...selectObject
            }
        })
        if(!user) throw new BadRequestException('User not found')

        return user

    }

    async updateProfile(id: number, dto: UserDto){
        const isSame = await this.userService.getByEmail(dto.email)

        if(isSame.id !== id) throw new BadRequestException('Email already in use')

        const user = await this.ById(id, {password:true})

        return await this.userService.update(dto, id, user.password)
    }

    async toggleFavorite(id: number, productId: number){
        const user = await this.ById(id)

        if (!user) throw new NotFoundException('User not found!')

        const isExists = user.favorites.some(product=>product.id === productId)
        return await this.userService.updateFavorites(id, productId, isExists)

    }
}
