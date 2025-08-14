import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConsultaDto {
  @IsString()
  @IsNotEmpty({ message: 'La pregunta no puede estar vacía' })
  pregunta!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    // Si es un objeto o array, convertirlo a JSON string
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    // Para cualquier otro tipo, convertir a string
    return String(value);
  }, { toClassOnly: true })
  @IsString()
  contexto?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}