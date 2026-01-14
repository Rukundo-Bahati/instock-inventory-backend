import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Log)
        private logsRepository: Repository<Log>,
    ) {}

    async create(createLogDto: CreateLogDto): Promise<Log> {
        const log = this.logsRepository.create(createLogDto);
        return this.logsRepository.save(log);
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        action?: string,
        search?: string,
    ): Promise<{ data: Log[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (action && action !== 'all') {
            where.action = action;
        }

        if (search) {
            // Search in userEmail, userName, or details
            const searchPattern = `%${search}%`;
            const [data, total] = await this.logsRepository
                .createQueryBuilder('log')
                .where(action && action !== 'all' ? 'log.action = :action' : '1=1', { action })
                .andWhere(
                    '(log.userEmail ILIKE :search OR log.userName ILIKE :search OR log.details ILIKE :search)',
                    { search: searchPattern }
                )
                .orderBy('log.createdAt', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount();

            return { data, total, page, limit };
        }

        const [data, total] = await this.logsRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async getStats(): Promise<{ totalLogs: number; totalLogins: number }> {
        const totalLogs = await this.logsRepository.count();
        const totalLogins = await this.logsRepository.count({ where: { action: 'login' } });
        return { totalLogs, totalLogins };
    }
}
