import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Movement])],
    controllers: [MovementsController],
    providers: [MovementsService],
    exports: [MovementsService],
})
export class MovementsModule {}
