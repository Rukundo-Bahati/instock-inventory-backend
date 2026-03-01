import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('movements')
@Controller('movements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MovementsController {
    constructor(private readonly movementsService: MovementsService) {}

    @Get()
    findAll(@Query('itemId') itemId: string | undefined, @CurrentUser() user: any) {
        if (itemId) {
            return this.movementsService.findByItem(itemId, user.id, user.roles);
        }
        return this.movementsService.findAll(user.id, user.roles);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.movementsService.findOne(id);
    }

    @Post()
    create(@Body() createMovementDto: CreateMovementDto, @CurrentUser() user: any) {
        return this.movementsService.create(createMovementDto, user.id);
    }
}
