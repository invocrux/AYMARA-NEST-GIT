import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Prefijo global para la API
  app.setGlobalPrefix('api/v1');
  
  // Configuración de seguridad
  app.use(helmet());
  app.use(compression());
  
  // CORS configurado para orígenes permitidos
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  });
  
  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Filtros globales de excepciones
app.useGlobalFilters(
  new AllExceptionsFilter(),
  new HttpExceptionFilter()
);
  
  // Puerto de la aplicación
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Servidor AYMARA corriendo en puerto ${port}`);
}

bootstrap();