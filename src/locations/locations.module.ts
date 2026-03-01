import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
    imports: [TypeOrmModule.forFeature([Location]), LogsModule],
    controllers: [LocationsController],
    providers: [LocationsService],
    exports: [LocationsService],
})
export class LocationsModule {}
