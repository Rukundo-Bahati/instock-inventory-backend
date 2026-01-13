import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    roles: string;
}
