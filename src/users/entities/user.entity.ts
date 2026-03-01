import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ default: 'user' })
    roles: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'varchar' })
    resetToken: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    resetTokenExpiry: Date | null;
}
