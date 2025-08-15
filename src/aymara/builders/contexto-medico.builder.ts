import { ContextoMedico, Paciente, Diagnostico, ExamenFisico } from '../dto/set-context.dto';

/**
 * Builder para crear un contexto médico con parámetros opcionales
 */
export class ContextoMedicoBuilder {
  private _vista?: string;
  private _paciente?: Paciente;
  private _diagnosticos?: Diagnostico[];
  private _fechaEvolucion?: string;
  private _medicoAtencion?: string;
  private _examenFisico?: ExamenFisico;
  private _idEmpleado?: number;

  /**
   * Establece la vista del contexto
   * @param vista Nombre de la vista
   */
  setVista(vista: string): ContextoMedicoBuilder {
    this._vista = vista;
    return this;
  }

  /**
   * Establece la información del paciente
   * @param paciente Datos del paciente
   */
  setPaciente(paciente: Paciente): ContextoMedicoBuilder {
    this._paciente = paciente;
    return this;
  }

  /**
   * Establece los diagnósticos
   * @param diagnosticos Lista de diagnósticos
   */
  setDiagnosticos(diagnosticos: Diagnostico[]): ContextoMedicoBuilder {
    this._diagnosticos = diagnosticos;
    return this;
  }

  /**
   * Establece la fecha de evolución
   * @param fechaEvolucion Fecha de evolución
   */
  setFechaEvolucion(fechaEvolucion: string): ContextoMedicoBuilder {
    this._fechaEvolucion = fechaEvolucion;
    return this;
  }

  /**
   * Establece el médico de atención
   * @param medicoAtencion Nombre del médico
   */
  setMedicoAtencion(medicoAtencion: string): ContextoMedicoBuilder {
    this._medicoAtencion = medicoAtencion;
    return this;
  }

  /**
   * Establece el examen físico
   * @param examenFisico Datos del examen físico
   */
  setExamenFisico(examenFisico: ExamenFisico): ContextoMedicoBuilder {
    this._examenFisico = examenFisico;
    return this;
  }

  /**
   * Establece el ID del empleado
   * @param idEmpleado ID del empleado
   */
  setIdEmpleado(idEmpleado: number): ContextoMedicoBuilder {
    this._idEmpleado = idEmpleado;
    return this;
  }

  /**
   * Construye el objeto ContextoMedico con los parámetros establecidos
   * @returns Objeto ContextoMedico
   */
  build(): Partial<ContextoMedico> {
    const contexto: Partial<ContextoMedico> = {};
    
    if (this._vista) contexto.vista = this._vista;
    if (this._paciente) contexto.paciente = this._paciente;
    if (this._diagnosticos) contexto.diagnosticos = this._diagnosticos;
    if (this._fechaEvolucion) contexto.fechaEvolucion = this._fechaEvolucion;
    if (this._medicoAtencion) contexto.medicoAtencion = this._medicoAtencion;
    if (this._examenFisico) contexto.examenFisico = this._examenFisico;
    if (this._idEmpleado !== undefined) contexto.idEmpleado = this._idEmpleado;
    
    return contexto;
  }

  /**
   * Genera una descripción textual del contexto médico
   * @returns Descripción en formato de texto del contexto médico
   */
  buildAsText(): string {
    let descripcion = '';
    
    // Información del paciente
    if (this._paciente) {
      descripcion += `El paciente ${this._paciente.nombre || 'sin nombre'}`;
      
      if (this._paciente.identificacion) {
        descripcion += ` con identificación ${this._paciente.identificacion}`;
      }
      
      if (this._paciente.edad) {
        descripcion += `, de ${this._paciente.edad} años`;
      }
      
      if (this._paciente.sexo) {
        descripcion += `, de sexo ${this._paciente.sexo}`;
      }
    } else {
      descripcion += 'El paciente';
    }
    
    // Fecha de evolución y médico de atención
    if (this._fechaEvolucion || this._medicoAtencion) {
      descripcion += ' fue atendido';
      
      if (this._fechaEvolucion) {
        descripcion += ` el ${this._fechaEvolucion}`;
      }
      
      if (this._medicoAtencion) {
        descripcion += ` por el Dr./Dra. ${this._medicoAtencion}`;
      }
    }
    
    // Diagnósticos
    if (this._diagnosticos && this._diagnosticos.length > 0) {
      descripcion += ` presenta ${this._diagnosticos.length} diagnóstico${this._diagnosticos.length > 1 ? 's' : ''}: `;
      
      const diagnosticosTexto = this._diagnosticos.map((diagnostico, index) => {
        let texto = '';
        if (diagnostico.descripcion) {
          texto += diagnostico.descripcion;
          
          if (diagnostico.codigoDiagnostico) {
            texto += ` (código: ${diagnostico.codigoDiagnostico})`;
          }
          
          if (diagnostico.observacion) {
            texto += `. Observación: ${diagnostico.observacion}`;
          }
        } else if (diagnostico.codigoDiagnostico) {
          texto += `diagnóstico con código ${diagnostico.codigoDiagnostico}`;
        } else {
          texto += 'diagnóstico sin descripción';
        }
        return texto;
      }).join('; ');
      
      descripcion += diagnosticosTexto + '.';
    }
    
    // Examen físico
    if (this._examenFisico) {
      descripcion += ' En el examen físico se observa:';
      
      const examenes = [];
      if (this._examenFisico.cabeza) examenes.push(`Cabeza: ${this._examenFisico.cabeza}`);
      if (this._examenFisico.torax) examenes.push(`Tórax: ${this._examenFisico.torax}`);
      if (this._examenFisico.abdomen) examenes.push(`Abdomen: ${this._examenFisico.abdomen}`);
      if (this._examenFisico.extremidades) examenes.push(`Extremidades: ${this._examenFisico.extremidades}`);
      if (this._examenFisico.genitarioUrinario) examenes.push(`Sistema genitourinario: ${this._examenFisico.genitarioUrinario}`);
      if (this._examenFisico.cardioPulmonar) examenes.push(`Sistema cardiopulmonar: ${this._examenFisico.cardioPulmonar}`);
      if (this._examenFisico.sNervCentral) examenes.push(`Sistema nervioso central: ${this._examenFisico.sNervCentral}`);
      
      if (examenes.length > 0) {
        descripcion += ' ' + examenes.join('. ') + '.';
      }
    }
    
    // Vista
    if (this._vista) {
      descripcion += ` Esta información corresponde a la vista "${this._vista}".`;
    }
    
    // ID de empleado
    if (this._idEmpleado !== undefined) {
      descripcion += ` Registrado por el empleado con ID ${this._idEmpleado}.`;
    }
    
    return descripcion.trim();
  }
}