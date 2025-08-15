import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

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
    
    const now = Date.now();
    
    // Registrar inicio de la solicitud
    this.logger.log(
      `[${requestId}] ${method} ${url} - Iniciando procesamiento`,
    );
    
    // Registrar cuerpo de la solicitud (sin datos sensibles)
    if (body && Object.keys(body).length > 0) {
      // Aquí podrías implementar lógica para ocultar datos sensibles
      const sanitizedBody = { ...body };
      
      // Excluir el contexto del logging para evitar duplicación
      if (sanitizedBody.contexto) {
        delete sanitizedBody.contexto;
      }
      
      // Solo loggear si hay otros campos además del contexto
      if (Object.keys(sanitizedBody).length > 0) {
        this.logger.debug(
          `[${requestId}] Cuerpo de la solicitud: ${JSON.stringify(sanitizedBody)}`,
        );
      }
    }
    
    return next.handle().pipe(
      tap({
        next: (data: any) => {
          // Registrar finalización exitosa
          const duration = Date.now() - now;
          this.logger.log(
            `[${requestId}] ${method} ${url} - Completado en ${duration}ms`,
          );
        },
        error: (error: Error) => {
          // Registrar error
          const duration = Date.now() - now;
          this.logger.error(
            `[${requestId}] ${method} ${url} - Error en ${duration}ms: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}