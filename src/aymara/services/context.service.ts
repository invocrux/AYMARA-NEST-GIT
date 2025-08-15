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
   * @param contextoMedico Datos del contexto médico (todos opcionales)
   * @returns Builder para construir el contexto
   */
  crearContexto(contextoMedico?: Partial<ContextoMedico>): string {
    const builder = new ContextoMedicoBuilder();

    if (!contextoMedico) return builder.buildAsText();

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
   * @param contextoMedico Datos del contexto médico (todos opcionales)
   * @returns El ID del empleado utilizado como clave
   */
  guardarContexto(contextoMedico?: Partial<ContextoMedico>): number {
    // Crear el contexto en formato texto usando el método existente
    const contextoTexto = this.crearContexto(contextoMedico);

    // Determinar el ID del empleado a usar como clave
    const idEmpleado =
      contextoMedico?.idEmpleado !== undefined
        ? contextoMedico.idEmpleado
        : 2723;

    // Guardar en el mapa
    this.contextMap.set(idEmpleado, contextoTexto);

    return idEmpleado;
  }

  /**
   * Obtiene el contexto médico almacenado para un ID de empleado específico
   * @param idEmpleado ID del empleado cuyo contexto se desea obtener
   * @returns El contexto médico en formato texto o null si no existe
   */
  obtenerContextoPorEmpleado(idEmpleado: number): string | null {
    const contexto = this.contextMap.get(idEmpleado);
    return contexto !== undefined ? contexto : null;
  }
}
