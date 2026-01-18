import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global error handling
  app.useGlobalFilters();
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8081',
      'http://localhost:3001',
      'https://instock-inventory-pro.vercel.app',
      'https://instock-back.onrender.com',
      /^https:\/\/.*\.onrender\.com$/,
      /^https:\/\/.*\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('InStock Inventory Pro API')
    .setDescription('The InStock Inventory Pro API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  console.log(`🚀 Server starting on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
  console.log(`📧 Email configured: ${!!process.env.EMAIL_USER}`);
  console.log(`🗄️ Database URL configured: ${!!process.env.DATABASE_URL}`);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
