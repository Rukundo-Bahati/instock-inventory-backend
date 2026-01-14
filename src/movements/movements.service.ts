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

    async findAll(): Promise<Movement[]> {
        return this.movementsRepository.find({ order: { createdAt: 'DESC' }, take: 100 });
    }

    async findByItem(itemId: string): Promise<Movement[]> {
        return this.movementsRepository.find({ where: { itemId }, order: { createdAt: 'DESC' } });
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
