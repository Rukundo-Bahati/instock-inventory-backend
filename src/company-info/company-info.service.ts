import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyInfo } from './entities/company-info.entity';

@Injectable()
export class CompanyInfoService {
    constructor(
        @InjectRepository(CompanyInfo)
        private companyInfoRepository: Repository<CompanyInfo>,
    ) {
        this.seedDefaultData();
    }

    private async seedDefaultData() {
        try {
            const count = await this.companyInfoRepository.count();
            if (count === 0) {
                await this.companyInfoRepository.save({
                    companyName: 'InStock Inventory Pro',
                    email: 'support@instock.com',
                    phone: '+250 788 000 000',
                    address: 'Kigali, Rwanda',
                    website: 'https://instock.com',
                    description: 'Professional inventory management system',
                });
                console.log('✅ Default company info created');
            }
        } catch (error) {
            console.log('ℹ️ Company info seeding skipped:', error.message);
        }
    }

    async get(): Promise<CompanyInfo | null> {
        const info = await this.companyInfoRepository.find({ take: 1 });
        return info[0] || null;
    }

    async update(updateData: Partial<CompanyInfo>): Promise<CompanyInfo> {
        const info = await this.get();
        if (info) {
            Object.assign(info, updateData);
            return this.companyInfoRepository.save(info);
        }
        // Create if doesn't exist
        const newInfo = this.companyInfoRepository.create(updateData);
        return this.companyInfoRepository.save(newInfo);
    }
}
