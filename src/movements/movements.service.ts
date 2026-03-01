import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movement } from './entities/movement.entity';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class MovementsService {
    constructor(
        @InjectRepository(Movement)
        private movementsRepository: Repository<Movement>,
    ) {}

    async findAll(userId?: string, userRole?: string): Promise<Movement[]> {
        const queryBuilder = this.movementsRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.item', 'item')
            .orderBy('movement.createdAt', 'DESC')
            .take(100);
        
        // Regular users only see their own movements
        if (userRole !== 'admin' && userId) {
            queryBuilder.where('movement.userId = :userId', { userId });
        }
        
        return queryBuilder.getMany();
    }

    async findByItem(itemId: string, userId?: string, userRole?: string): Promise<Movement[]> {
        const queryBuilder = this.movementsRepository
            .createQueryBuilder('movement')
            .leftJoinAndSelect('movement.item', 'item')
            .where('movement.itemId = :itemId', { itemId })
            .orderBy('movement.createdAt', 'DESC');
        
        // Regular users only see their own movements
        if (userRole !== 'admin' && userId) {
            queryBuilder.andWhere('movement.userId = :userId', { userId });
        }
        
        return queryBuilder.getMany();
    }

    async findOne(id: string): Promise<Movement> {
        const movement = await this.movementsRepository.findOne({ where: { id } });
        if (!movement) {
            throw new NotFoundException(`Movement with ID ${id} not found`);
        }
        return movement;
    }

    async create(createMovementDto: CreateMovementDto, userId: string | null): Promise<Movement> {
        const movement = this.movementsRepository.create({
            ...createMovementDto,
            userId: userId ?? undefined,
        });
        return this.movementsRepository.save(movement);
    }
}
