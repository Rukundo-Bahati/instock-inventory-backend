import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;

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
