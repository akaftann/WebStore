import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { CategoryDbService } from 'src/db-services/category-sevice';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, CategoryDbService]
})
export class CategoryModule {}
