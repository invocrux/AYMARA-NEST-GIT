import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class TransformContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransformContextInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    if (body && body.contexto) {
      const originalContexto = body.contexto;
      this.logger.debug(`Tipo de contexto original: ${typeof body.contexto}`);
      
      // Si es un objeto, convertirlo a string JSON
      if (typeof body.contexto === 'object') {
        body.contexto = JSON.stringify(body.contexto);
        this.logger.debug('Contexto convertido de objeto a string JSON');
      } 
      // Si es un string que parece un JSON escapado (comienza y termina con comillas dobles)
      else if (typeof body.contexto === 'string') {
        // Caso 1: String con comillas dobles al inicio y final (JSON escapado)
        if (body.contexto.startsWith('"') && body.contexto.endsWith('"')) {
          try {
            // Intentar desescapar el string JSON
            const unescaped = JSON.parse(body.contexto);
            this.logger.debug(`Contexto desescapado: tipo=${typeof unescaped}`);
            
            // Si el resultado es un string que parece JSON, mantenerlo así
            if (typeof unescaped === 'string' && 
                (unescaped.startsWith('{') || unescaped.startsWith('['))) {
              body.contexto = unescaped;
              this.logger.debug('Contexto procesado: string JSON desescapado');
            } else {
              // Si no parece JSON, mantener el string desescapado
              body.contexto = unescaped;
              this.logger.debug('Contexto procesado: string normal desescapado');
            }
          } catch (e: any) {
            // Si falla el desescapado, mantener el string original
            this.logger.debug(`Error al desescapar contexto: ${e?.message || 'Error desconocido'}`);
          }
        }
        // Caso 2: String que parece un objeto JSON escapado pero sin comillas externas
        else if (body.contexto.includes('\\"')) {
          try {
            // Intentar desescapar manualmente el string
            // Primero verificamos si es el formato específico del curl proporcionado
            if (body.contexto.startsWith('\"') && body.contexto.endsWith('\"')) {
              // Eliminar las comillas escapadas al inicio y final
              const contenido = body.contexto.substring(2, body.contexto.length - 2);
              this.logger.debug(`Procesando formato específico del curl: ${contenido.substring(0, 30)}...`);
              body.contexto = contenido;
              this.logger.debug('Contexto procesado: formato específico del curl');
            } 
            // Caso específico del curl proporcionado por el usuario
            else if (body.contexto.startsWith('"\\"') && body.contexto.endsWith('\\""')) {
              // Este es el caso exacto del curl proporcionado
              const contenidoEscapado = body.contexto.substring(3, body.contexto.length - 3);
              this.logger.debug(`Procesando formato exacto del curl: ${contenidoEscapado.substring(0, 30)}...`);
              
              // Reemplazar los escapes dobles por escapes simples
              const contenidoDesescapado = contenidoEscapado.replace(/\\\\/g, '\\');
              body.contexto = contenidoDesescapado;
              this.logger.debug('Contexto procesado: formato exacto del curl');
            } else {
              // Intentar parsear como JSON si parece un objeto JSON con escapes
              try {
                const jsonObj = JSON.parse(`"${body.contexto}"`);
                if (typeof jsonObj === 'string' && 
                    (jsonObj.startsWith('{') || jsonObj.startsWith('['))) {
                  body.contexto = jsonObj;
                  this.logger.debug('Contexto procesado: string JSON con escapes');
                }
              } catch (e: any) {
                // Si falla, intentar otro enfoque
                this.logger.debug(`Error al parsear JSON con escapes: ${e?.message || 'Error desconocido'}`);
              }
            }
          } catch (e: any) {
            // Si falla, mantener el original
            this.logger.debug(`Error al procesar contexto con escapes: ${e?.message || 'Error desconocido'}`);
          }
        }
      }
      
      // Log para depuración
      if (originalContexto !== body.contexto) {
        this.logger.debug('Contexto transformado correctamente');
      }
    }

    return next.handle();
  }
}