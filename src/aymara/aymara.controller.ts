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
import { SetContextDto, ContextoMedico } from "./dto/set-context.dto";
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
    const contextoSesion = this.contextService.obtenerContextoPorEmpleado(
      createConsultaDto.idEmpleado
    );
    console.log("Contexto actual en sesión:", contextoSesion);
    console.log("Session ID:", request.session?.id);
    console.log("Headers:", JSON.stringify(request.headers));
    return this.aymaraService.procesarConsulta(
      createConsultaDto,
      contextoSesion
    );
  }

  @Post("contexto")
  @HttpCode(HttpStatus.OK)
  async setContext(
    @Body() contextoMedico: ContextoMedico,
    @Req() request: Request
  ) {
    if (contextoMedico) {
      this.contextService.guardarContexto(contextoMedico);
      return { message: "Se a creado el contexto correctamente" };
    }

    return { message: "No se proporcionó contexto para guardar" };
  }
  // @Post("limpiar-contexto")
  // @HttpCode(HttpStatus.OK)
  // async clearContext(@Req() request: Request) {
  //   this.contextService.clearContext(request);
  //   return { message: "Contexto eliminado correctamente" };
  // }
}
