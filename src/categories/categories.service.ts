import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        private logsService: LogsService,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Category> {
        const existing = await this.categoriesRepository.findOne({ where: { name: createCategoryDto.name } });
        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }
        const category = this.categoriesRepository.create(createCategoryDto);
        const savedCategory = await this.categoriesRepository.save(category);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'category_create',
            details: `Created category: ${savedCategory.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return savedCategory;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Category> {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        const updatedCategory = await this.categoriesRepository.save(category);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'category_update',
            details: `Updated category: ${updatedCategory.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedCategory;
    }

    async remove(id: string, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<void> {
        const category = await this.findOne(id);
        const categoryName = category.name;
        await this.categoriesRepository.remove(category);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'category_delete',
            details: `Deleted category: ${categoryName}`,
            userEmail,
            userName,
            userRole,
        });
    }
}
