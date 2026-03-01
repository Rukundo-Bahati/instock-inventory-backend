import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfoService } from './company-info.service';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfo } from './entities/company-info.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CompanyInfo])],
    controllers: [CompanyInfoController],
    providers: [CompanyInfoService],
    exports: [CompanyInfoService],
})
export class CompanyInfoModule {}
