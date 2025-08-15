import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

// Interfaz para el examen físico
export interface ExamenFisico {
  torax?: string;
  abdomen?: string;
  cabeza?: string;
  extremidades?: string;
  genitarioUrinario?: string;
  cardioPulmonar?: string;
  sNervCentral?: string;
}

// Interfaz para el diagnóstico
export interface Diagnostico {
  codigoEvo?: number;
  codigoDiagnostico?: string;
  descripcion?: string;
  estado?: string;
  observacion?: string;
}

// Interfaz para el paciente
export interface Paciente {
  nombre?: string;
  identificacion?: string;
  edad?: string;
  sexo?: string;
}

// Interfaz para el contexto médico
export interface ContextoMedico {
  vista?: string;
  paciente?: Paciente;
  diagnosticos?: Diagnostico[];
  fechaEvolucion?: string;
  medicoAtencion?: string;
  examenFisico?: ExamenFisico;
  idEmpleado?: number;
}

export class SetContextDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    // Si es un objeto o array, convertirlo a JSON string
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    // Si es otro tipo, convertirlo a string
    return String(value);
  })
  contexto?: string;
}