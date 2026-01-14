import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
    ) {}

    async findAll(): Promise<Location[]> {
        return this.locationsRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<Location> {
        const location = await this.locationsRepository.findOne({ where: { id } });
        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const location = this.locationsRepository.create(createLocationDto);
        return this.locationsRepository.save(location);
    }

    async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
        const location = await this.findOne(id);
        Object.assign(location, updateLocationDto);
        return this.locationsRepository.save(location);
    }

    async remove(id: string): Promise<void> {
        const location = await this.findOne(id);
        await this.locationsRepository.remove(location);
    }
}
