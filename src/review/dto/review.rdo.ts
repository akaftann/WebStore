import { Prisma } from "@prisma/client";
import { profileObject } from "src/user/dto/profile.rdo";

export const returnReview: Prisma.ReviewSelect = {
    user: {select: profileObject},
    createdAt: true,
    id: true,
    rating: true,
    text: true
}