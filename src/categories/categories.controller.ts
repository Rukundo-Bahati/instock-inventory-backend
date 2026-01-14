import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
        return this.categoriesService.create(
            createCategoryDto,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
        return this.categoriesService.update(
            id,
            updateCategoryDto,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.categoriesService.remove(
            id,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }
}
