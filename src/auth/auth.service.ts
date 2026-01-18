import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private logsService: LogsService,
        private mailerService: MailerService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            console.error('Validate user error:', error);
            return null;
        }
    }

    async login(user: any) {
        try {
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
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
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

    async forgotPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to user
        await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpiry);

        // Create reset URL (adjust the domain based on your frontend URL)
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        // Send email with reset token
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Password Reset Request - InStock Inventory',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p>Hello ${user.firstName || user.email},</p>
                        <p>You have requested to reset your password for your InStock Inventory account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #007bff; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 12px;">
                            This is an automated message from InStock Inventory Management System.
                        </p>
                    </div>
                `,
            });

            // Log the password reset request
            await this.logsService.create({
                userId: user.id,
                action: 'forgot_password',
                details: `Password reset email sent to ${user.email}`,
                userEmail: user.email,
                userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                userRole: user.roles,
            });

            return { 
                message: 'Password reset email sent successfully'
            };
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new BadRequestException('Failed to send password reset email');
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await this.usersService.updatePassword(user.id, hashedPassword);
        await this.usersService.clearResetToken(user.id);

        // Log the password reset
        await this.logsService.create({
            userId: user.id,
            action: 'reset_password',
            details: `Password reset successfully`,
            userEmail: user.email,
            userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            userRole: user.roles,
        });

        return { message: 'Password reset successfully' };
    }

    async testEmail(email: string) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Test Email - InStock Inventory',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Email Configuration Test</h2>
                        <p>Hello!</p>
                        <p>This is a test email to verify that the InStock Inventory email configuration is working correctly.</p>
                        <p>If you received this email, the configuration is successful!</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 12px;">
                            This is a test message from InStock Inventory Management System.
                        </p>
                    </div>
                `,
            });

            return { message: 'Test email sent successfully' };
        } catch (error) {
            console.error('Failed to send test email:', error);
            throw new BadRequestException(`Failed to send test email: ${error.message}`);
        }
    }
}
