import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Obtener el requestId generado por el LoggingInterceptor
    const requestId = request.requestId || 'unknown';

    // Determinar el status code y mensaje
    let status: number;
    let errorMessage: string;
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      // Para excepciones HTTP, usar el status y respuesta de la excepción
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        errorMessage = (exceptionResponse as any).error || (exceptionResponse as any).message || 'Error interno';
        errorDetails = (exceptionResponse as any).message ? (exceptionResponse as any) : null;
      } else {
        errorMessage = 'Error interno';
      }
    } else {
      // Para errores no HTTP (errores 500), usar status 500 y mensaje genérico
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      
      // En producción, ocultar detalles técnicos
      if (process.env.NODE_ENV === 'production') {
        errorMessage = 'Error interno del servidor';
      } else {
        // En desarrollo, mostrar más detalles
        errorMessage = exception instanceof Error ? exception.message : 'Error desconocido';
        if (exception instanceof Error) {
          errorDetails = {
            name: exception.name,
            stack: exception.stack,
          };
        }
      }
    }

    // Registrar el error
    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - ${status} - ${errorMessage}`,
      errorDetails ? JSON.stringify(errorDetails) : '',
      'AllExceptionsFilter',
    );

    // Respuesta formateada
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
      requestId,
      ...(process.env.NODE_ENV !== 'production' && errorDetails && { details: errorDetails }),
    };

    response.status(status).json(responseBody);
  }
}