import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('locations')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.locationsService.findAll(user.id, user.roles);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationsService.findOne(id);
    }

    @Post()
    create(@Body() createLocationDto: CreateLocationDto, @CurrentUser() user: any) {
        return this.locationsService.create(
            createLocationDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto, @CurrentUser() user: any) {
        return this.locationsService.update(
            id,
            updateLocationDto,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.locationsService.remove(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Patch(':id/toggle-active')
    @UseGuards(RolesGuard)
    @Roles('admin')
    toggleActive(@Param('id') id: string, @CurrentUser() user: any) {
        return this.locationsService.toggleActive(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }
}
