import { PrismaClient, Product } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const createProduct = async(qty: number) => {
    const products: Product[] = []

    for(let i = 0; i < qty; i++){
        const productName = faker.commerce.productName()
        const productCategory = faker.commerce.department()

        const product = await prisma.product.create({
            data:{
                name: productName,
                slug: faker.helpers.slugify(productName).toLowerCase(),
                description: faker.commerce.productDescription(),
                price: +faker.commerce.price({min:10,max:999,dec:0}),
                images: Array.from({length: faker.number.int({min:2, max:6})}).map(()=>faker.image.url({width:500, height:500})),
                category: {create:{
                    name: productCategory,
                    slug: faker.helpers.slugify(productCategory).toLowerCase()
                }},
                reviews: {create:{
                    rating: faker.number.int({min:1, max:5}),
                    text: faker.lorem.paragraph(),
                    user: {
                        connect:{
                        id: 2
                    }}
                }}

            }
        })
        products.push(product)
    }

console.log(`generated ${products.length} products`)

}

async function main() {
    console.log('Start seeding...')
    await createProduct(10)
    
}

main()
.catch(e=>console.log(e.message))
.finally(async()=>prisma.$disconnect())