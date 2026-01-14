import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('logs')
@Controller('logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Post()
    create(@Body() createLogDto: CreateLogDto) {
        return this.logsService.create(createLogDto);
    }

    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('action') action?: string,
        @Query('search') search?: string,
    ) {
        return this.logsService.findAll(
            parseInt(page, 10),
            parseInt(limit, 10),
            action,
            search,
        );
    }

    @Get('stats')
    getStats() {
        return this.logsService.getStats();
    }
}
