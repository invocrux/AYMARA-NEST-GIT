import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extraer mensaje de error
    let errorMessage: string;
    let errorDetails: any = null;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      errorMessage = (exceptionResponse as any).error || (exceptionResponse as any).message || 'Error interno';
      errorDetails = (exceptionResponse as any).message ? (exceptionResponse as any) : null;
    } else {
      errorMessage = 'Error interno';
    }

    // Registrar el error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
      errorDetails ? JSON.stringify(errorDetails) : '',
      'HttpExceptionFilter',
    );

    // Respuesta formateada
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
      ...(errorDetails && { details: errorDetails }),
    };

    response.status(status).json(responseBody);
  }
}