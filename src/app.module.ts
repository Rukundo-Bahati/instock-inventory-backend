import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { MovementsModule } from './movements/movements.module';
import { ItemsModule } from './items/items.module';
import { LogsModule } from './logs/logs.module';
import { CompanyInfoModule } from './company-info/company-info.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL 
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'instock',
          }
      ),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      logging: process.env.NODE_ENV !== 'production',
    }),
    MailerModule.forRoot({
      transport: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      } : {
        // Fallback configuration for when email is not configured
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      },
      defaults: {
        from: `"InStock Inventory" <${process.env.EMAIL_USER || 'noreply@instock.com'}>`,
      },
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    LocationsModule,
    MovementsModule,
    ItemsModule,
    LogsModule,
    CompanyInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
