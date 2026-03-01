import { Controller, Get, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return this.usersService.findById(user.id);
    }

    @Put('profile')
    updateProfile(@Body() updateData: any, @CurrentUser() user: any) {
        return this.usersService.updateProfile(
            user.id,
            updateData,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Get(':id')
    @Roles('admin')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @Roles('admin')
    update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
        return this.usersService.updateUser(
            id,
            updateData,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Patch(':id/toggle-active')
    @Roles('admin')
    toggleActive(@Param('id') id: string, @CurrentUser() user: any) {
        return this.usersService.toggleActive(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.usersService.deleteUser(
            id,
            user.id,
            user.email,
            user.email,
            user.roles,
        );
    }
}
