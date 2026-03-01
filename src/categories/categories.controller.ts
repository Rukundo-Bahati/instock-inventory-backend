import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.categoriesService.findAll(user.id, user.roles);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: any) {
        return this.categoriesService.create(
            createCategoryDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: any) {
        return this.categoriesService.update(
            id,
            updateCategoryDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.categoriesService.remove(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Patch(':id/toggle-active')
    @UseGuards(RolesGuard)
    @Roles('admin')
    toggleActive(@Param('id') id: string, @CurrentUser() user: any) {
        return this.categoriesService.toggleActive(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }
}
