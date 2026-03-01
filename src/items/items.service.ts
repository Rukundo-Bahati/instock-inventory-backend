import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
        private logsService: LogsService,
    ) {}

    async findAll(userId?: string, userRole?: string): Promise<Item[]> {
        const queryBuilder = this.itemsRepository.createQueryBuilder('item');
        
        // Regular users only see their own items
        if (userRole !== 'admin' && userId) {
            queryBuilder.where('item.createdBy = :userId', { userId });
        }
        
        // Filter active items for regular users
        if (userRole !== 'admin') {
            queryBuilder.andWhere('item.status = :status', { status: 'active' });
        }
        
        return queryBuilder.orderBy('item.createdAt', 'DESC').getMany();
    }

    async findOne(id: string): Promise<Item> {
        const item = await this.itemsRepository.findOne({ where: { id } });
        if (!item) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }

    async findBySku(sku: string): Promise<Item | null> {
        return this.itemsRepository.findOne({ where: { sku } });
    }

    async create(createItemDto: CreateItemDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Item> {
        const existing = await this.findBySku(createItemDto.sku);
        if (existing) {
            throw new ConflictException('Item with this SKU already exists');
        }
        const item = this.itemsRepository.create({
            ...createItemDto,
            createdBy: userId,
        });
        const savedItem = await this.itemsRepository.save(item);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'item_create',
            details: `Created item: ${savedItem.name} (SKU: ${savedItem.sku})`,
            userEmail,
            userName,
            userRole,
        });
        
        return savedItem;
    }

    async update(id: string, updateItemDto: UpdateItemDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Item> {
        const item = await this.findOne(id);
        
        if (updateItemDto.sku && updateItemDto.sku !== item.sku) {
            const existing = await this.findBySku(updateItemDto.sku);
            if (existing) {
                throw new ConflictException('Item with this SKU already exists');
            }
        }
        
        Object.assign(item, updateItemDto);
        const updatedItem = await this.itemsRepository.save(item);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'item_update',
            details: `Updated item: ${updatedItem.name} (SKU: ${updatedItem.sku})`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedItem;
    }

    async remove(id: string, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<void> {
        const item = await this.findOne(id);
        const itemName = item.name;
        const itemSku = item.sku;
        await this.itemsRepository.remove(item);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'item_delete',
            details: `Deleted item: ${itemName} (SKU: ${itemSku})`,
            userEmail,
            userName,
            userRole,
        });
    }

    async getLowStock(userId?: string, userRole?: string): Promise<Item[]> {
        const queryBuilder = this.itemsRepository
            .createQueryBuilder('item')
            .where('item.quantity <= item.minStock')
            .andWhere('item.quantity > 0');
        
        // Regular users only see their own items
        if (userRole !== 'admin' && userId) {
            queryBuilder.andWhere('item.createdBy = :userId', { userId });
        }
        
        return queryBuilder.orderBy('item.quantity', 'ASC').getMany();
    }

    async getOutOfStock(userId?: string, userRole?: string): Promise<Item[]> {
        const queryBuilder = this.itemsRepository
            .createQueryBuilder('item')
            .where('item.quantity = 0');
        
        // Regular users only see their own items
        if (userRole !== 'admin' && userId) {
            queryBuilder.andWhere('item.createdBy = :userId', { userId });
        }
        
        return queryBuilder.orderBy('item.name', 'ASC').getMany();
    }
}
