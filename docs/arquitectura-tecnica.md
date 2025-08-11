# Arquitectura Técnica de la API AYMARA

Este documento describe la arquitectura técnica de la API AYMARA, sus componentes principales y el flujo de datos.

## Visión General

La API AYMARA es una aplicación backend construida con NestJS que proporciona un servicio de consultas sobre el sistema de salud colombiano utilizando la API de OpenAI. La arquitectura sigue los principios de Clean Architecture y SOLID, con una clara separación de responsabilidades.

## Tecnologías Principales

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Validación**: class-validator
- **Configuración**: @nestjs/config
- **Seguridad**: helmet, @nestjs/throttler
- **Integración**: OpenAI API
- **Logging**: Logger nativo de NestJS con UUID
- **Contenedorización**: Docker

## Estructura del Proyecto

```
src/
├── aymara/                  # Módulo principal de AYMARA
│   ├── dto/                 # Data Transfer Objects
│   │   └── create-consulta.dto.ts
│   ├── aymara.controller.ts # Controlador de endpoints
│   ├── aymara.module.ts     # Configuración del módulo
│   └── aymara.service.ts    # Lógica de negocio
├── common/                  # Componentes compartidos
│   ├── controllers/         # Controladores comunes
│   │   └── health.controller.ts
│   ├── filters/             # Filtros de excepciones
│   │   ├── http-exception.filter.ts
│   │   └── all-exceptions.filter.ts
│   ├── guards/              # Guardias de seguridad
│   │   └── api-key.guard.ts
│   └── interceptors/        # Interceptores
│       └── logging.interceptor.ts
├── types/                   # Definiciones de tipos
│   └── express.d.ts         # Extensión de tipos Express
├── app.module.ts            # Módulo raíz
└── main.ts                  # Punto de entrada
```

## Componentes Clave

### 1. Módulo AYMARA

El módulo principal que contiene la lógica de negocio para procesar consultas relacionadas con el sistema de salud colombiano.

#### AymaraController

Maneja las solicitudes HTTP entrantes y las dirige al servicio apropiado.

```typescript
@Controller('aymara')
@UseInterceptors(LoggingInterceptor)
export class AymaraController {
  constructor(private readonly aymaraService: AymaraService) {}

  @Get('consulta')
  async createConsulta(@Query() createConsultaDto: CreateConsultaDto) {
    return this.aymaraService.procesarConsulta(createConsultaDto);
  }
}
```

#### AymaraService

Contiene la lógica de negocio para procesar consultas, incluyendo:

- Validación de preguntas (dentro vs. fuera de alcance)
- Integración con la API de OpenAI
- Manejo de errores específicos del dominio

### 2. Seguridad

#### ThrottlerGuard

Implementa limitación de tasa (rate limiting) para proteger la API contra abusos.

```typescript
// Configuración en app.module.ts
ThrottlerModule.forRoot({
  ttl: 60, // tiempo en segundos
  limit: 30, // número máximo de solicitudes en el período ttl
})
```

La API utiliza el ThrottlerGuard para limitar el número de solicitudes que un cliente puede hacer en un período de tiempo determinado, protegiendo así contra ataques de denegación de servicio y uso excesivo de recursos.
```

### 3. Manejo de Errores

#### AllExceptionsFilter

Captura todas las excepciones no manejadas y proporciona respuestas consistentes con información de seguimiento.

#### HttpExceptionFilter

Maneja específicamente las excepciones HTTP lanzadas intencionalmente por la aplicación.

### 4. Logging

#### LoggingInterceptor

Genera un ID único para cada solicitud y registra información detallada sobre el ciclo de vida de la solicitud.

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    
    // Generar un ID único para la solicitud
    const requestId = uuidv4();
    request.requestId = requestId;
    
    // Añadir el requestId a los headers de respuesta
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-Request-ID', requestId);
    
    // ... lógica de logging
  }
}
```

## Flujo de Datos

1. **Solicitud entrante**: El cliente envía una solicitud GET a `/api/v1/aymara/consulta`
2. **Middleware global**: Se aplican middleware de seguridad (helmet, compression)
3. **CORS**: Se verifica si el origen está permitido
4. **Rate limiting**: El `ThrottlerGuard` verifica si el cliente ha excedido el límite de solicitudes
5. **Logging**: El `LoggingInterceptor` genera un ID único y registra la solicitud
6. **Validación**: Los DTOs son validados automáticamente por `ValidationPipe`
7. **Controlador**: `AymaraController` recibe la solicitud validada
8. **Servicio**: `AymaraService` procesa la consulta:
   - Valida si la pregunta está dentro del alcance
   - Prepara los mensajes para OpenAI
   - Llama a la API de OpenAI
   - Procesa la respuesta
9. **Respuesta**: Se devuelve la respuesta al cliente
10. **Manejo de errores**: Si ocurre un error en cualquier punto, es capturado por los filtros de excepciones

## Configuración

La aplicación utiliza variables de entorno para configuración, cargadas a través de `@nestjs/config`:

```
OPENAI_API_KEY=tu_api_key_de_openai
DEFAULT_MODEL=gpt-4-turbo
DEFAULT_TEMPERATURE=0.3
CORS_ORIGINS=http://localhost:3000,https://tu-frontend.com
PORT=3000
NODE_ENV=development
THROTTLE_TTL=60
THROTTLE_LIMIT=30
```

## Despliegue

La aplicación está configurada para ser desplegada como un contenedor Docker:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Producción
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Y orquestada con Docker Compose:

```yaml
version: '3.8'

services:
  aymara-api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: aymara-api
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Consideraciones de Seguridad

1. **Rate Limiting**: Previene ataques de fuerza bruta y abuso de la API mediante ThrottlerGuard
2. **Helmet**: Configura encabezados HTTP relacionados con seguridad
3. **CORS**: Restringe qué orígenes pueden acceder a la API
4. **Validación**: Previene inyecciones y datos malformados
5. **Filtrado de contenido**: Rechaza preguntas fuera del alcance o potencialmente dañinas
6. **Autenticación externa**: La autenticación es manejada por otro backend

## Escalabilidad

La arquitectura permite escalar horizontalmente:

1. **Stateless**: La aplicación no mantiene estado entre solicitudes
2. **Contenedorización**: Facilita el despliegue en múltiples instancias
3. **Configuración externalizada**: Permite diferentes configuraciones por entorno
4. **Logging centralizado**: Con IDs de solicitud para seguimiento entre instancias

## Extensibilidad

Para añadir nuevas funcionalidades:

1. **Nuevos endpoints**: Crear nuevos controladores en el módulo existente o en nuevos módulos
2. **Integración con más servicios**: Añadir nuevos servicios y proveedores en los módulos correspondientes
3. **Middleware personalizado**: Implementar nuevos interceptores, guardias o filtros según sea necesario