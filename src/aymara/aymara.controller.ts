import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { AymaraService } from './aymara.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@Controller('aymara')
@UseInterceptors(LoggingInterceptor)
export class AymaraController {
  constructor(private readonly aymaraService: AymaraService) {}

  @Get('consulta')
  async createConsulta(@Query() createConsultaDto: CreateConsultaDto) {
    return this.aymaraService.procesarConsulta(createConsultaDto);
  }
}