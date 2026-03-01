import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.itemsService.findAll(user.id, user.roles);
    }

    @Get('low-stock')
    getLowStock(@CurrentUser() user: any) {
        return this.itemsService.getLowStock(user.id, user.roles);
    }

    @Get('out-of-stock')
    getOutOfStock(@CurrentUser() user: any) {
        return this.itemsService.getOutOfStock(user.id, user.roles);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Post()
    create(@Body() createItemDto: CreateItemDto, @CurrentUser() user: any) {
        return this.itemsService.create(
            createItemDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @CurrentUser() user: any) {
        return this.itemsService.update(
            id,
            updateItemDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.itemsService.remove(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }
}
