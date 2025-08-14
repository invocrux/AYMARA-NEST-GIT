import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseInterceptors,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AymaraService } from "./aymara.service";
import { CreateConsultaDto } from "./dto/create-consulta.dto";
import { LoggingInterceptor } from "../common/interceptors/logging.interceptor";
import { TransformContextInterceptor } from "../common/interceptors/transform-context.interceptor";
import { SetContextDto } from "./dto/set-context.dto";
import { ContextService } from "./services/context.service";
import { Request } from "express";

@Controller("aymara")
@UseInterceptors(LoggingInterceptor, TransformContextInterceptor)
export class AymaraController {
  constructor(
    private readonly aymaraService: AymaraService,
    private readonly contextService: ContextService
  ) {}

  @Get("consulta")
  async getConsulta(
    @Query() createConsultaDto: CreateConsultaDto,
    @Req() request: Request
  ) {
    const contextoSesion = this.contextService.getContext(request);
    if (contextoSesion) {
      createConsultaDto.contexto = contextoSesion;
    }

    return this.aymaraService.procesarConsulta(createConsultaDto);
  }

  @Post("contexto")
  @HttpCode(HttpStatus.OK)
  async setContext(
    @Body() setContextDto: SetContextDto,
    @Req() request: Request
  ) {
    if (setContextDto.contexto) {
      this.contextService.saveContext(request, setContextDto.contexto);
      return { message: "Contexto guardado correctamente" };
    }

    return { message: "No se proporcionó contexto para guardar" };
  }

  @Post("limpiar-contexto")
  @HttpCode(HttpStatus.OK)
  async clearContext(@Req() request: Request) {
    this.contextService.clearContext(request);
    return { message: "Contexto eliminado correctamente" };
  }
}
