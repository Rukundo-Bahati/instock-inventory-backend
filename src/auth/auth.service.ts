import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private logsService: LogsService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        
        // Log the login action
        await this.logsService.create({
            userId: user.id,
            action: 'login',
            details: `User logged in`,
            userEmail: user.email,
            userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            userRole: user.roles,
        });

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(user: any) {
        // Check if user already exists
        const existingUser = await this.usersService.findOneByEmail(user.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.create({
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        // Log the registration
        await this.logsService.create({
            userId: newUser.id,
            action: 'register',
            details: `New user registered`,
            userEmail: newUser.email,
            userName: `${newUser.firstName || ''} ${newUser.lastName || ''}`.trim() || newUser.email,
            userRole: newUser.roles,
        });

        return newUser;
    }

    async logout(user: any) {
        // Log the logout action
        await this.logsService.create({
            userId: user.id,
            action: 'logout',
            details: `User logged out`,
            userEmail: user.email,
            userName: user.email,
            userRole: user.roles,
        });

        return { message: 'Logged out successfully' };
    }
}
