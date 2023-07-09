import { IsNumber, IsOptional, IsString } from "class-validator";

export class CategoryDto{
    @IsString()
    name: string
}

export class SearchCategoryDto{
    @IsOptional()
    @IsString()
    slug: string

    @IsOptional()
    @IsNumber()
    id: number
}