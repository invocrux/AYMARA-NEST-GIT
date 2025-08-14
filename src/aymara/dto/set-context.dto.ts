import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

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