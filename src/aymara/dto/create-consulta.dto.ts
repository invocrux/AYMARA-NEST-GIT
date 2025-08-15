import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsInt,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateConsultaDto {
  @IsString()
  @IsNotEmpty({ message: "La pregunta no puede estar vacía" })
  pregunta!: string;

  @IsInt()
  idEmpleado: number = 2723;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
