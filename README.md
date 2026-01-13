# InStock Inventory Pro - Backend

A robust NestJS backend API for the InStock Inventory Pro application. This server provides authentication, user management, email services, and API documentation with Swagger.

##  Features

### Core Functionality
- **RESTful API**: Well-structured REST API endpoints
- **Authentication & Authorization**: JWT-based authentication system
- **User Management**: Complete user CRUD operations
- **Email Services**: Email sending capabilities with Nodemailer
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database Integration**: PostgreSQL with TypeORM

### Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Passport Strategies**: Local and JWT passport strategies
- **CORS Enabled**: Cross-Origin Resource Sharing configured
- **Environment Variables**: Secure configuration management

### Email Features
- **User Registration**: Welcome emails for new users
- **Password Reset**: Email-based password recovery
- **Email Verification**: Account verification via email
- **Mailer Module**: Configured with Gmail SMTP

## Tech Stack

### Core Framework
- **NestJS 11.0.1**: Progressive Node.js framework
- **TypeScript 5.7.3**: Type-safe development
- **Node.js**: Runtime environment

### Database
- **PostgreSQL 15**: Relational database
- **TypeORM 0.3.28**: ORM for database operations
- **pg 8.16.3**: PostgreSQL client

### Authentication
- **Passport 0.7.0**: Authentication middleware
- **Passport-JWT 4.0.1**: JWT authentication strategy
- **Passport-Local 1.0.0**: Local authentication strategy
- **@nestjs/jwt 11.0.2**: JWT utilities for NestJS
- **bcrypt 6.0.0**: Password hashing

### Email
- **@nestjs-modules/mailer 2.0.2**: Email module for NestJS
- **nodemailer 7.0.12**: Email sending library

### API Documentation
- **@nestjs/swagger 11.2.4**: OpenAPI/Swagger integration
- **swagger-ui-express 5.0.1**: Swagger UI

### Development Tools
- **ESLint 9.18.0**: Code linting
- **Prettier 3.4.2**: Code formatting
- **Jest 30.0.0**: Testing framework
- **TypeScript ESLint**: TypeScript linting

##  Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **PostgreSQL**: Version 15.x or higher
- **Docker** (optional): For containerized deployment
- **Docker Compose** (optional): For multi-container setup


**Important Notes:**
- **JWT_SECRET**: Use a strong, random secret in production
- **EMAIL_PASS**: Use Gmail App Password, not your regular password
  - Enable 2FA on Gmail
  - Generate App Password: Google Account → Security → 2-Step Verification → App passwords

### 4. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE instock;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE instock TO postgres;
\q
```

#### Option B: Docker PostgreSQL

```bash
docker run --name instock-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=instock \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 5. Start the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:4045`

### 6. Access API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:4045/api
```

## 📜 Available Scripts

### Development
```bash
npm run start:dev
```
Starts the development server with watch mode and hot reload.

```bash
npm run start:debug
```
Starts the server in debug mode.

### Production
```bash
npm run build
```
Builds the application for production.

```bash
npm run start:prod
```
Runs the production build.

### Testing
```bash
npm run test
```
Runs unit tests.

```bash
npm run test:watch
```
Runs tests in watch mode.

```bash
npm run test:cov
```
Generates test coverage report.

```bash
npm run test:e2e
```
Runs end-to-end tests.

### Code Quality
```bash
npm run lint
```
Runs ESLint and fixes issues.

```bash
npm run format
```
Formats code with Prettier.


## Docker Deployment

### Using Docker Compose (Recommended)

The project includes a `docker-compose.yml` file for easy deployment:

```bash
# Start all services (backend + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Services:**
- **app**: NestJS backend (port 3020)
- **db**: PostgreSQL database (port 5434 → 5432)

**Note:** The Docker setup uses port 3020 for the backend and 5434 for PostgreSQL to avoid conflicts.

### Docker Compose Configuration

```yaml
services:
  app:
    build: .
    ports:
      - "3020:3020"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres
      - DB_DATABASE=instock
      - JWT_SECRET=supersecretkey
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_USER=your-email@gmail.com
      - EMAIL_PASS=your-app-password
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    ports:
      - "5434:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=instock
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Manual Docker Build

```bash
# Build image
docker build -t instock-backend .

# Run container
docker run -p 4045:4045 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=instock \
  -e JWT_SECRET=your-secret \
  instock-backend
```

## Authentication Flow

### Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Routes
```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##  Email Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### Other Email Providers

For other SMTP providers, update the configuration:

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@provider.com
EMAIL_PASS=your-password
EMAIL_SECURE=false
```

## API Documentation (Swagger)

Access the interactive API documentation at:

```
http://localhost:4045/api
```

Features:
- **Interactive Testing**: Test endpoints directly from the browser
- **Schema Definitions**: View request/response schemas
- **Authentication**: Test protected endpoints with JWT tokens
- **Examples**: See example requests and responses

### Using Swagger for Authentication

1. Click "Authorize" button
2. Enter: `Bearer your-jwt-token`
3. Click "Authorize"
4. Test protected endpoints

##  Database

### TypeORM Configuration

The application uses TypeORM with PostgreSQL:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'instock',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
})
```

** Important:** Set `synchronize: false` in production and use migrations instead.

### Database Migrations

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

##  Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

##  Production Deployment

### Environment Variables for Production

```env
# Use strong secrets
JWT_SECRET=use-a-very-strong-random-secret-here

# Production database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=strong-db-password
DB_DATABASE=instock_production

# Production email
EMAIL_HOST=smtp.your-provider.com
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-email-password

# Server
PORT=4045
NODE_ENV=production
```

### Deployment Checklist

- [ ] Set `synchronize: false` in TypeORM config
- [ ] Use database migrations
- [ ] Set strong `JWT_SECRET`
- [ ] Use production database credentials
- [ ] Configure production email service
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Use environment-specific configs

### Deployment Options

1. **VPS/Cloud Server** (AWS EC2, DigitalOcean, etc.)
   ```bash
   npm run build
   pm2 start dist/main.js --name instock-api
   ```

2. **Docker**
   ```bash
   docker-compose up -d
   ```

3. **Heroku**
   ```bash
   heroku create instock-api
   git push heroku main
   ```

4. **AWS/GCP/Azure**
   - Use container services (ECS, Cloud Run, Container Instances)
   - Or deploy to managed Node.js platforms

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d instock
```

### Port Already in Use

```bash
# Find process using port 4045
lsof -i :4045

# Kill process
kill -9 <PID>
```

### Email Not Sending

- Verify Gmail App Password is correct
- Check 2FA is enabled
- Ensure "Less secure app access" is OFF (use App Password instead)
- Check firewall/network allows SMTP connections

### Docker Issues

```bash
# View logs
docker-compose logs -f app

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build
```

##  Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow NestJS best practices
- Use TypeScript strict mode
- Write tests for new features
- Run linter before committing: `npm run lint`
- Format code: `npm run format`

##  License

This project is private and proprietary.

