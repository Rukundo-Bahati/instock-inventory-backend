import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    sku: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'int', default: 10 })
    minStock: number;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
