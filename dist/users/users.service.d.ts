import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LogsService } from '../logs/logs.service';
export declare class UsersService {
    private usersRepository;
    private logsService;
    constructor(usersRepository: Repository<User>, logsService: LogsService);
    findOne(username: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    updateProfile(userId: string, updateData: Partial<User>, userEmail?: string, userName?: string, userRole?: string): Promise<User>;
}
