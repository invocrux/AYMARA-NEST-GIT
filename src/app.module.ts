import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AymaraModule } from './aymara/aymara.module';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    // Configuración global con variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting global
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL', 60), // tiempo en segundos
            limit: configService.get<number>('THROTTLE_LIMIT', 30), // número de solicitudes por ttl
          },
        ],
      }),
    }),
    
    // Módulos de la aplicación
    AymaraModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}