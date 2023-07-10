import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/pagination/dto/pagination.dto";

export enum EnumProductsSort{
    HIGH_PRICE='high_price',
    LOW_PRICE='low_price',
    OLDEST='oldest',
    NEWEST='newest'
}

export class GetAllProductDto extends PaginationDto{

    @IsOptional()
    @IsEnum(EnumProductsSort)
    sort?:EnumProductsSort

    @IsOptional()
    @IsString()
    searchItem?: string
}