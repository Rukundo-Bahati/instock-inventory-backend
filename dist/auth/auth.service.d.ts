import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private logsService;
    constructor(usersService: UsersService, jwtService: JwtService, logsService: LogsService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(user: any): Promise<import("../users/entities/user.entity").User>;
    logout(user: any): Promise<{
        message: string;
    }>;
}
