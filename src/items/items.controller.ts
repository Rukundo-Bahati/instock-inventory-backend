import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    findAll() {
        return this.itemsService.findAll();
    }

    @Get('low-stock')
    getLowStock() {
        return this.itemsService.getLowStock();
    }

    @Get('out-of-stock')
    getOutOfStock() {
        return this.itemsService.getOutOfStock();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Post()
    create(@Body() createItemDto: CreateItemDto, @Request() req) {
        return this.itemsService.create(
            createItemDto,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @Request() req) {
        return this.itemsService.update(
            id,
            updateItemDto,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.itemsService.remove(
            id,
            req.user.id,
            req.user.email,
            req.user.email,
            req.user.roles,
        );
    }
}
