import { IsEmail, IsString, MinLength } from "class-validator"

export  class AuthDto{
    @IsEmail()
    email: string

    @MinLength(5,{message: "password must have at least 5 symbols"})
    @IsString()
    password: string
}