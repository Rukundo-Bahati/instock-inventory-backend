import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CompanyInfo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    companyName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ nullable: true })
    website: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
