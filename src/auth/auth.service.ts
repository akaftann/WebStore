import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../db-services/user-service';
import { verify } from 'argon2';



@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private userService: UserService){}
   
    async register(dto: AuthDto){
        const user = await this.userService.create(dto)

        const tokens = await this.issueToken(user.id)
        return {user: this.returnUserFields(user),
        ...tokens}
    }

    async login (dto: AuthDto) {
        const user = await this.validateUser(dto)
        const tokkens = await this.issueToken(user.id)

        return {user: this.returnUserFields(user), ...tokkens}

    }

    async getNewTokens (refreshToken: string) {
        console.log(refreshToken)
        const res = await this.jwt.verifyAsync(refreshToken)
        
        if(!res) throw new UnauthorizedException('Invalid refresh token')

        const user = await this.userService.getById(res.id)

        const tokens = await this.issueToken(user.id)
        return {user: this.returnUserFields(user),
            ...tokens}
    }

    private async issueToken (userId: number) {
        const data = {id: userId}

        const accessToken = this.jwt.sign(data, {expiresIn: '1h'})
        const refreshToken = this.jwt.sign(data, {expiresIn: '3d'})
        return {accessToken, refreshToken}
    }

    private returnUserFields(user: User){
        return {
            id: user.id,
            email: user.email
        }
    }

    private async validateUser(dto: AuthDto){
        const user = await this.userService.getByEmail(dto.email)

        const isValid = await verify(user.password, dto.password)
        if(!isValid) throw new UnauthorizedException('Ivalid password')

        return user
    }   

   /* async getAll(){
    const users = this.prisma.user.findMany()
    return users
   } */
}
