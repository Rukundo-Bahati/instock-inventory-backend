import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    itemId: string;

    @Column()
    type: string; // 'in', 'out', 'adjustment'

    @Column()
    quantity: number;

    @Column({ nullable: true })
    reason: string;

    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @Column({ type: 'uuid', nullable: true })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}
