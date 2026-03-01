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

console.log('=== ENV DEBUG ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('=================');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
          url: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        }
        : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'instock',
          ssl: false,
        }
      ),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables on first run
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