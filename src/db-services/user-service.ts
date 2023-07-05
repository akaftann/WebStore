import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthDto } from "../auth/dto/auth.dto";
import { faker } from '@faker-js/faker';
import { hash} from "argon2";
import { UserDto } from "src/user/dto/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async getById (id: number) {
        const user = await this.prisma.user.findUnique({where:{id: id}})
        if(!user) throw new NotFoundException('There is no such user')
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
        await this.prisma.user.update({where:{
            id
        },data:{
            favorites: {
                [isExists? 'disconnect' : 'connect']:
                {id: productId}
            }
            
        }})
        return "Success"

    }
}