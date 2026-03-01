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

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.POSTGRES_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'postgresql://postgres:UTcbakeNsbpFIKhQWzbZccNxZudNfgKv@postgres.railway.internal:5432/railway'
    : undefined);

const hasDbHost =
  !!process.env.DB_HOST || !!process.env.PGHOST || !!process.env.POSTGRES_HOST;
const hasDbPort =
  !!process.env.DB_PORT || !!process.env.PGPORT || !!process.env.POSTGRES_PORT;
const hasDbUser =
  !!process.env.DB_USERNAME || !!process.env.PGUSER || !!process.env.POSTGRES_USER;
const hasDbPassword =
  !!process.env.DB_PASSWORD || !!process.env.PGPASSWORD || !!process.env.POSTGRES_PASSWORD;
const hasDbName =
  !!process.env.DB_DATABASE || !!process.env.PGDATABASE || !!process.env.POSTGRES_DB;

console.log('=== ENV DEBUG ===');
console.log('DATABASE_URL exists:', !!databaseUrl);
console.log('DB_HOST/PGHOST exists:', hasDbHost);
console.log('DB_PORT/PGPORT exists:', hasDbPort);
console.log('DB_USERNAME/PGUSER exists:', hasDbUser);
console.log('DB_PASSWORD/PGPASSWORD exists:', hasDbPassword);
console.log('DB_DATABASE/PGDATABASE exists:', hasDbName);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('=================');

if (
  process.env.NODE_ENV === 'production' &&
  !databaseUrl &&
  !hasDbHost
) {
  throw new Error(
    'Database is not configured. Set DATABASE_URL (recommended) or DB_HOST/DB_PORT/DB_USERNAME/DB_PASSWORD/DB_DATABASE.'
  );
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(databaseUrl
        ? {
          url: databaseUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
        : {
          host: process.env.DB_HOST || process.env.PGHOST || process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || process.env.PGPORT || process.env.POSTGRES_PORT || '5432', 10),
          username: process.env.DB_USERNAME || process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
          password:
            process.env.DB_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || process.env.PGDATABASE || process.env.POSTGRES_DB || 'instock',
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
