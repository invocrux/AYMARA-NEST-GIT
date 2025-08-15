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
   * Genera una descripción textual del contexto médico procesando dinámicamente cualquier propiedad
   * @param contextoCompleto Objeto completo del contexto médico con cualquier estructura
   * @returns Descripción en formato de texto del contexto médico
   */
  buildAsText(contextoCompleto?: any): string {
    // Si se proporciona un contexto completo, procesarlo dinámicamente
    if (contextoCompleto) {
      return this.procesarContextoDinamico(contextoCompleto);
    }
    
    // Mantener la lógica original para compatibilidad
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

  /**
   * Procesa dinámicamente cualquier estructura de contexto médico
   * @param contexto Objeto con cualquier estructura de contexto médico
   * @returns Descripción textual del contexto
   */
  private procesarContextoDinamico(contexto: any): string {
    let descripcion = '';
    
    // Información básica del paciente
    if (contexto.nombrePaciente) {
      descripcion += `El paciente ${contexto.nombrePaciente}`;
      
      if (contexto.numeroDocumento) {
        descripcion += ` con documento ${contexto.tipoDocumento || 'ID'}: ${contexto.numeroDocumento}`;
      }
      
      if (contexto.edad) {
        descripcion += `, ${contexto.edad}`;
      }
      
      if (contexto.genero) {
        descripcion += `, género ${contexto.genero}`;
      }
      
      if (contexto.fechaNacimiento) {
        const fecha = new Date(contexto.fechaNacimiento).toLocaleDateString('es-CO');
        descripcion += `, nacido el ${fecha}`;
      }
      
      descripcion += '.\n\n';
    }
    
    // Información del ingreso
    if (contexto.idIngreso) {
      descripcion += `**INFORMACIÓN DEL INGRESO:**\n`;
      descripcion += `- ID de Ingreso: ${contexto.idIngreso}\n`;
      
      if (contexto.fechaIngreso) {
        const fechaIngreso = new Date(contexto.fechaIngreso).toLocaleString('es-CO');
        descripcion += `- Fecha de Ingreso: ${fechaIngreso}\n`;
      }
      
      if (contexto.estadoIngreso) {
        descripcion += `- Estado: ${contexto.estadoIngreso}\n`;
      }
      
      if (contexto.numeroRegistro) {
        descripcion += `- Número de Registro: ${contexto.numeroRegistro}\n`;
      }
      
      if (contexto.modulo) {
        descripcion += `- Módulo: ${contexto.modulo.toUpperCase()}\n`;
      }
      
      descripcion += '\n';
    }
    
    // Información de la orden médica actual
    if (contexto.ordenMedicaActual) {
      const orden = contexto.ordenMedicaActual;
      descripcion += `**ORDEN MÉDICA ACTUAL:**\n`;
      descripcion += `- ID de Orden: ${orden.id}\n`;
      
      if (orden.fecha) {
        const fechaOrden = new Date(orden.fecha).toLocaleString('es-CO');
        descripcion += `- Fecha: ${fechaOrden}\n`;
      }
      
      if (orden.peso) {
        descripcion += `- Peso del paciente: ${orden.peso} kg\n`;
      }
      
      // Información del médico
      if (orden.usuario) {
        const medico = orden.usuario;
        descripcion += `- Médico: ${medico.nombreCompleto || medico.empleado}\n`;
        if (medico.cedula) descripcion += `- Cédula del médico: ${medico.cedula}\n`;
        if (medico.cargo) descripcion += `- Cargo: ${medico.cargo}\n`;
        if (medico.especialidad && medico.especialidad !== 'NINGUNA') {
          descripcion += `- Especialidad: ${medico.especialidad}\n`;
        }
        if (medico.empresa) descripcion += `- Institución: ${medico.empresa}\n`;
      }
      
      // Procesar medicamentos si están presentes
      if (orden.medicamentos && Array.isArray(orden.medicamentos)) {
        descripcion += `- Medicamentos prescritos:\n`;
        orden.medicamentos.forEach((medicamento: string) => {
          descripcion += `  • ${medicamento}\n`;
        });
      }
      
      descripcion += '\n';
    }
    
    // Procesar diagnósticos
    if (contexto.diagnosticos && Array.isArray(contexto.diagnosticos)) {
      descripcion += `**DIAGNÓSTICOS:**\n`;
      contexto.diagnosticos.forEach((diagnostico: string, index: number) => {
        descripcion += `${index + 1}. ${diagnostico}\n`;
      });
      descripcion += '\n';
    }
    
    // Información de estancia
    if (contexto.estancia && Array.isArray(contexto.estancia) && contexto.estancia.length > 0) {
      descripcion += `**HISTORIAL DE ESTANCIA:**\n`;
      contexto.estancia.forEach((estancia: any, index: number) => {
        const fecha = new Date(estancia.diaEstancia).toLocaleDateString('es-CO');
        descripcion += `${index + 1}. ${fecha}: ${estancia.descripcion}`;
        if (estancia.justificacionEstancia) {
          descripcion += ` - ${estancia.justificacionEstancia}`;
        }
        descripcion += '\n';
      });
      descripcion += '\n';
    }
    
    // Información del componente y contexto técnico
    if (contexto.componente) {
      descripcion += `**CONTEXTO TÉCNICO:**\n`;
      descripcion += `- Componente: ${contexto.componente}\n`;
      
      if (contexto.idEmpleado) {
        descripcion += `- ID Empleado: ${contexto.idEmpleado}\n`;
      }
      
      descripcion += '\n';
    }
    
    // Procesar cualquier otra propiedad no contemplada
    const propiedadesProcesadas = [
      'nombrePaciente', 'numeroDocumento', 'tipoDocumento', 'edad', 'genero', 'fechaNacimiento',
      'idIngreso', 'fechaIngreso', 'estadoIngreso', 'numeroRegistro', 'modulo',
      'ordenMedicaActual', 'estancia', 'componente', 'idEmpleado', 'diagnosticos'
    ];
    
    const propiedadesAdicionales = Object.keys(contexto).filter(key => 
      !propiedadesProcesadas.includes(key) && 
      contexto[key] !== null && 
      contexto[key] !== undefined &&
      contexto[key] !== ''
    );
    
    if (propiedadesAdicionales.length > 0) {
      descripcion += `**INFORMACIÓN ADICIONAL:**\n`;
      propiedadesAdicionales.forEach(key => {
        const valor = typeof contexto[key] === 'object' 
          ? JSON.stringify(contexto[key], null, 2)
          : contexto[key];
        descripcion += `- ${key}: ${valor}\n`;
      });
    }
    
    return descripcion.trim();
  }
}