import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private logsService: LogsService,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async updateProfile(userId: string, updateData: Partial<User>, userEmail?: string, userName?: string, userRole?: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        
        // Handle password change if provided
        if (updateData['currentPassword'] && updateData['newPassword']) {
            const bcrypt = require('bcrypt');
            const isPasswordValid = await bcrypt.compare(updateData['currentPassword'], user.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            // Hash new password
            user.password = await bcrypt.hash(updateData['newPassword'], 10);
            delete updateData['currentPassword'];
            delete updateData['newPassword'];
        }
        
        // Update other fields
        if (updateData.firstName !== undefined) user.firstName = updateData.firstName;
        if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
        if (updateData.email !== undefined) user.email = updateData.email;
        
        const updatedUser = await this.usersRepository.save(user);
        
        // Log the action
        await this.logsService.create({
            userId,
            action: 'profile_update',
            details: `Updated profile information`,
            userEmail,
            userName,
            userRole,
        });
        
        return updatedUser;
    }

    async updateResetToken(userId: string, resetToken: string, resetTokenExpiry: Date): Promise<void> {
        await this.usersRepository.update(userId, { resetToken, resetTokenExpiry });
    }

    async findByResetToken(resetToken: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { resetToken } });
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await this.usersRepository.update(userId, { password: hashedPassword });
    }

    async clearResetToken(userId: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (user) {
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await this.usersRepository.save(user);
        }
    }

    // Admin-only methods for user management
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({ 
            select: ['id', 'username', 'email', 'firstName', 'lastName', 'roles', 'isActive'],
            order: { email: 'ASC' } 
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ 
            where: { id },
            select: ['id', 'username', 'email', 'firstName', 'lastName', 'roles', 'isActive']
        });
    }

    async updateUser(id: string, updateData: Partial<User>, adminId?: string, adminEmail?: string, adminName?: string, adminRole?: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        
        Object.assign(user, updateData);
        const updatedUser = await this.usersRepository.save(user);
        
        // Log the action
        await this.logsService.create({
            userId: adminId,
            action: 'user_update',
            details: `Updated user: ${updatedUser.email}`,
            userEmail: adminEmail,
            userName: adminName,
            userRole: adminRole,
        });
        
        return updatedUser;
    }

    async toggleActive(id: string, adminId?: string, adminEmail?: string, adminName?: string, adminRole?: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        
        user.isActive = !user.isActive;
        const updatedUser = await this.usersRepository.save(user);
        
        // Log the action
        await this.logsService.create({
            userId: adminId,
            action: 'user_toggle',
            details: `${updatedUser.isActive ? 'Activated' : 'Deactivated'} user: ${updatedUser.email}`,
            userEmail: adminEmail,
            userName: adminName,
            userRole: adminRole,
        });
        
        return updatedUser;
    }

    async deleteUser(id: string, adminId?: string, adminEmail?: string, adminName?: string, adminRole?: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        
        const userEmail = user.email;
        await this.usersRepository.remove(user);
        
        // Log the action
        await this.logsService.create({
            userId: adminId,
            action: 'user_delete',
            details: `Deleted user: ${userEmail}`,
            userEmail: adminEmail,
            userName: adminName,
            userRole: adminRole,
        });
    }
}
