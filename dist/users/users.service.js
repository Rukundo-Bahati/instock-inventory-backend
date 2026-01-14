"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const logs_service_1 = require("../logs/logs.service");
let UsersService = class UsersService {
    usersRepository;
    logsService;
    constructor(usersRepository, logsService) {
        this.usersRepository = usersRepository;
        this.logsService = logsService;
    }
    async findOne(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findOneByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async create(user) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
    async updateProfile(userId, updateData, userEmail, userName, userRole) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        if (updateData['currentPassword'] && updateData['newPassword']) {
            const bcrypt = require('bcrypt');
            const isPasswordValid = await bcrypt.compare(updateData['currentPassword'], user.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            user.password = await bcrypt.hash(updateData['newPassword'], 10);
            delete updateData['currentPassword'];
            delete updateData['newPassword'];
        }
        if (updateData.firstName !== undefined)
            user.firstName = updateData.firstName;
        if (updateData.lastName !== undefined)
            user.lastName = updateData.lastName;
        if (updateData.email !== undefined)
            user.email = updateData.email;
        const updatedUser = await this.usersRepository.save(user);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logs_service_1.LogsService])
], UsersService);
//# sourceMappingURL=users.service.js.map