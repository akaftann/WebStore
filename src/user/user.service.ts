import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService as UService } from 'src/db-services/user-service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor( private userService: UService){}

    async ById(id: number, selectObject: Prisma.UserSelect = {}){
       return await this.userService.getProfile(id, selectObject)
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

        const isExists = user.favorites.some((favorite) => favorite.productId === productId)
        return await this.userService.updateFavorites(id, productId, isExists)

    }
}
