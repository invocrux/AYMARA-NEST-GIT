import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateConsultaDto {
  @IsString()
  @IsNotEmpty({ message: 'La pregunta no puede estar vacía' })
  pregunta!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}