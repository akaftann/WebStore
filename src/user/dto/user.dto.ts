import { IsEmail, IsString, MinLength, IsOptional } from "class-validator"

export  class UserDto{
    @IsEmail()
    email: string

    @IsOptional()
    @MinLength(5,{message: "password must have at least 5 symbols"})
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    avatarPath: string
}