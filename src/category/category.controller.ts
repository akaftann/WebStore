import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auth()
  async getAll(){
    return this.categoryService.all()
  }

  @Get('by-slug/:slug')
  @Auth()
  async bySlug(@Param('slug') slug: string){
    return this.categoryService.BySlug(slug)
  }

  @Get(':id')
  @Auth()
  async byID(@Param('id') id: string){
    return this.categoryService.ById(+id)
  }

  @HttpCode(200)
  @Auth()
  @Post()
  async create(){
    return this.categoryService.create()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateUser(@Param('id') id: string,@Body() dto: CategoryDto){
    return this.categoryService.update(+id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') productId: string){
    return this.categoryService.delete(+productId)
  }
}
