import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //heq fushat që nuk janë në DTO
      forbidNonWhitelisted: true, // jep error nëse dërgohen fusha shtesë
      transform: true, // konverton input-in në tipet e DTO
    }),
  );

  //Konfigurimi i Swagger (dokumentimi i API-së)
  const config = new DocumentBuilder()
    .setTitle('Task Scheduler API')
    .setDescription('API documentation for Task Scheduler Application')
    .setVersion('1.0')
    .addBearerAuth() // shton fushën Authorization: Bearer token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Nis aplikacionin
  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
  console.log(`Swagger docs available at: http://localhost:3000/api`);
}
bootstrap();
