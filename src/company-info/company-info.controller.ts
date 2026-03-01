import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyInfoService } from './company-info.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('company-info')
@Controller('company-info')
export class CompanyInfoController {
    constructor(private readonly companyInfoService: CompanyInfoService) {}

    @Get()
    get() {
        return this.companyInfoService.get();
    }

    @Put()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    update(@Body() updateData: any) {
        return this.companyInfoService.update(updateData);
    }
}
