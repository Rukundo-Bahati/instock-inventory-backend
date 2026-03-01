import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
        private logsService: LogsService,
    ) {}

    async findAll(userId?: string, userRole?: string): Promise<Location[]> {
        const queryBuilder = this.locationsRepository.createQueryBuilder('location');
        
        // Regular users only see their own locations and active ones
        if (userRole !== 'admin' && userId) {
            queryBuilder.where('location.createdBy = :userId', { userId });
            queryBuilder.andWhere('location.isActive = :isActive', { isActive: true });
        }
        
        return queryBuilder.orderBy('location.name', 'ASC').getMany();
    }

    async findOne(id: string): Promise<Location> {
        const location = await this.locationsRepository.findOne({ where: { id } });
        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }

    async create(createLocationDto: CreateLocationDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Location> {
        const location = this.locationsRepository.create({
            ...createLocationDto,
            createdBy: userId,
        });
        const savedLocation = await this.locationsRepository.save(location);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'location_create',
            details: `Created location: ${savedLocation.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return savedLocation;
    }

    async update(id: string, updateLocationDto: UpdateLocationDto, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Location> {
        const location = await this.findOne(id);
        Object.assign(location, updateLocationDto);
        const updatedLocation = await this.locationsRepository.save(location);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'location_update',
            details: `Updated location: ${updatedLocation.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedLocation;
    }

    async remove(id: string, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<void> {
        const location = await this.findOne(id);
        const locationName = location.name;
        await this.locationsRepository.remove(location);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'location_delete',
            details: `Deleted location: ${locationName}`,
            userEmail,
            userName,
            userRole,
        });
    }

    async toggleActive(id: string, userId?: string, userEmail?: string, userName?: string, userRole?: string): Promise<Location> {
        const location = await this.findOne(id);
        location.isActive = !location.isActive;
        const updatedLocation = await this.locationsRepository.save(location);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'location_toggle',
            details: `${updatedLocation.isActive ? 'Activated' : 'Deactivated'} location: ${updatedLocation.name}`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedLocation;
    }
}
