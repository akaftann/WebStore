import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { GetAllProductDto } from './dto/get-all.products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() dto: GetAllProductDto){
    return this.productService.getAll(dto)
  }

  @Get('/:id')
  async getById(@Param('id') id: string){
    return this.productService.byId(+id)
  }

  @Get('/similar/:id')
  async getSimilar(@Param('id') id: string){
    return this.productService.getSimilar(+id)
  }

  @Get('/by-slug/:slug')
  async getBySlug(@Param('slug') slug: string){
    return this.productService.bySlug(slug)
  }

  @Get('/by-category/:slug')
  async getByCategory(@Param('slug') slug: string){
    return this.productService.getByCategory(slug)
  }

  
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct(){
    return await this.productService.create()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Body() dto: ProductDto, @Param('id') id: string){
    return await this.productService.updateProduct(+id,dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string){
    return await this.productService.delete(+id)
  }


}
