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

    async findAll(userId?: string, userRole?: string): Promise<Category[]> {
        const queryBuilder = this.categoriesRepository.createQueryBuilder('category');
        
        // Regular users only see their own categories and active ones
        if (userRole !== 'admin' && userId) {
            queryBuilder.where('category.createdBy = :userId', { userId });
            queryBuilder.andWhere('category.isActive = :isActive', { isActive: true });
        }
        
        return queryBuilder.orderBy('category.name', 'ASC').getMany();
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
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            createdBy: userId,
        });
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

    async toggleActive(id: string, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Category> {
        const category = await this.findOne(id);
        category.isActive = !category.isActive;
        const updatedCategory = await this.categoriesRepository.save(category);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'category_toggle',
            details: `${updatedCategory.isActive ? 'Activated' : 'Deactivated'} category: ${updatedCategory.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedCategory;
    }
}
