import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyInfo } from './entities/company-info.entity';

@Injectable()
export class CompanyInfoService {
    constructor(
        @InjectRepository(CompanyInfo)
        private companyInfoRepository: Repository<CompanyInfo>,
    ) {}

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
