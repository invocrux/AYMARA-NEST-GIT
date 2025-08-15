import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { ContextoMedico } from "../dto/set-context.dto";
import { ContextoMedicoBuilder } from "../builders/contexto-medico.builder";

@Injectable()
export class ContextService {
  // Mapa para almacenar contextos por idEmpleado
  private contextMap: Map<number, string> = new Map<number, string>();
  /**
   * Crea un contexto médico utilizando el patrón Builder
   * @param contextoMedico Datos del contexto médico (cualquier estructura)
   * @returns Texto del contexto médico procesado
   */
  crearContexto(contextoMedico?: any): string {
    const builder = new ContextoMedicoBuilder();

    if (!contextoMedico) return builder.buildAsText();

    // Si el contexto tiene propiedades que no están en la interfaz estándar,
    // usar el procesamiento dinámico
    const propiedadesEstandar = ['vista', 'paciente', 'diagnosticos', 'fechaEvolucion', 'medicoAtencion', 'examenFisico', 'idEmpleado'];
    const tienePropsAdicionales = Object.keys(contextoMedico).some(key => !propiedadesEstandar.includes(key));
    
    if (tienePropsAdicionales) {
      // Usar procesamiento dinámico para contextos complejos
      return builder.buildAsText(contextoMedico);
    }

    // Mantener lógica original para contextos estándar
    if (contextoMedico.vista) builder.setVista(contextoMedico.vista);
    if (contextoMedico.paciente) builder.setPaciente(contextoMedico.paciente);
    if (contextoMedico.diagnosticos)
      builder.setDiagnosticos(contextoMedico.diagnosticos);
    if (contextoMedico.fechaEvolucion)
      builder.setFechaEvolucion(contextoMedico.fechaEvolucion);
    if (contextoMedico.medicoAtencion)
      builder.setMedicoAtencion(contextoMedico.medicoAtencion);
    if (contextoMedico.examenFisico)
      builder.setExamenFisico(contextoMedico.examenFisico);
    if (contextoMedico.idEmpleado !== undefined)
      builder.setIdEmpleado(contextoMedico.idEmpleado);

    return builder.buildAsText();
  }

  /**
   * Guarda el contexto médico en el mapa usando el idEmpleado como clave
   * @param contextoMedico Datos del contexto médico (cualquier estructura)
   * @param idEmpleadoParam ID del empleado (opcional, se usa si se proporciona)
   * @returns El ID del empleado utilizado como clave
   */
  guardarContexto(contextoMedico?: any, idEmpleadoParam?: number): number {
    // Crear el contexto en formato texto usando el método existente
    const contextoTexto = this.crearContexto(contextoMedico);
    console.log(`Contexto creado: ${contextoTexto}`);

    // Determinar el ID del empleado a usar como clave (prioridad: parámetro > contexto > default)
    const idEmpleado = idEmpleadoParam ||
      contextoMedico?.idEmpleado ||
      2723;

    console.log(`Guardando contexto para empleado ID: ${idEmpleado}`);
    
    // Guardar en el mapa
    this.contextMap.set(idEmpleado, contextoTexto);
    console.log(`Contexto guardado exitosamente. Total contextos: ${this.contextMap.size}`);

    return idEmpleado;
  }

  /**
   * Obtiene el contexto médico almacenado para un ID de empleado específico
   * @param idEmpleado ID del empleado cuyo contexto se desea obtener
   * @returns El contexto médico en formato texto o null si no existe
   */
  obtenerContextoPorEmpleado(idEmpleado: number): string | null {
    const contexto = this.contextMap.get(idEmpleado);
    console.log(`Buscando contexto para empleado ID: ${idEmpleado}`);
    console.log(`Contexto encontrado: ${contexto}`);
    console.log(`Contextos disponibles en mapa:`, Array.from(this.contextMap.entries()));
    return contexto !== undefined ? contexto : null;
  }
}
