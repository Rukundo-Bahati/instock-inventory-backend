import { Controller, Get, Put, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findOneByEmail(req.user.email);
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body() updateData: any) {
        try {
            return await this.usersService.updateProfile(
                req.user.id,
                updateData,
                req.user.email,
                req.user.email,
                req.user.roles,
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
