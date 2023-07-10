import { Prisma } from "@prisma/client";
import { returnCategory } from "src/category/dto/category.rdo";
import { returnReview } from "src/review/dto/review.rdo";


export const returnProducts: Prisma.ProductSelect = {
    images: true,
    description: true,
    id: true,
    name: true,
    price: true,
    createdAt: true,
    slug: true
}

export const returnProductsFull: Prisma.ProductSelect ={
    ...returnProducts,
    reviews: {select:{...returnReview}},
    category:{select:{...returnCategory}}
} 