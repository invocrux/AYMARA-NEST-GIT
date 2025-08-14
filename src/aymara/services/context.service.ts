import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ContextService {
  /**
   * Guarda el contexto en la sesión del usuario
   * @param request Objeto de solicitud Express
   * @param contexto Contexto a guardar
   */
  saveContext(request: Request, contexto: string): void {
    if (!request.session) {
      throw new Error('La sesión no está disponible');
    }
    
    // Guardar el contexto en la sesión usando indexación
    (request.session as any)['contexto'] = contexto;
  }

  /**
   * Obtiene el contexto almacenado en la sesión del usuario
   * @param request Objeto de solicitud Express
   * @returns El contexto almacenado o null si no hay contexto
   */
  getContext(request: Request): string | null {
    if (!request.session || !(request.session as any)['contexto']) {
      return null;
    }
    
    return (request.session as any)['contexto'];
  }

  /**
   * Elimina el contexto almacenado en la sesión del usuario
   * @param request Objeto de solicitud Express
   */
  clearContext(request: Request): void {
    if (request.session && (request.session as any)['contexto']) {
      delete (request.session as any)['contexto'];
    }
  }
}