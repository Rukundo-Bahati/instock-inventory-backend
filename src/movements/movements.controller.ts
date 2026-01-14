import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('movements')
@Controller('movements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MovementsController {
    constructor(private readonly movementsService: MovementsService) {}

    @Get()
    findAll(@Query('itemId') itemId?: string) {
        if (itemId) {
            return this.movementsService.findByItem(itemId);
        }
        return this.movementsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.movementsService.findOne(id);
    }

    @Post()
    create(@Body() createMovementDto: CreateMovementDto, @Request() req) {
        const userId = req.user?.id || null;
        return this.movementsService.create(createMovementDto, userId);
    }
}
