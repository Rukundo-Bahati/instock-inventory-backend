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

    async findAll(): Promise<Item[]> {
        return this.itemsRepository.find({ order: { createdAt: 'DESC' } });
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
        const item = this.itemsRepository.create(createItemDto);
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

    async getLowStock(): Promise<Item[]> {
        return this.itemsRepository
            .createQueryBuilder('item')
            .where('item.quantity <= item.minStock')
            .andWhere('item.quantity > 0')
            .orderBy('item.quantity', 'ASC')
            .getMany();
    }

    async getOutOfStock(): Promise<Item[]> {
        return this.itemsRepository.find({ 
            where: { quantity: 0 },
            order: { name: 'ASC' }
        });
    }
}
