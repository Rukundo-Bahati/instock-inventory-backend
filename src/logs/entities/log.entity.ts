import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Log {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    userId: string;

    @Column()
    action: string; // 'login', 'logout', 'profile_update', 'item_create', 'item_update', 'item_delete', etc.

    @Column({ type: 'text', nullable: true })
    details: string;

    @Column({ nullable: true })
    userEmail: string;

    @Column({ nullable: true })
    userName: string;

    @Column({ nullable: true })
    userRole: string;

    @CreateDateColumn()
    createdAt: Date;
}
