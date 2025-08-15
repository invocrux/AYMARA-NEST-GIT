import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Headers,
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
  async setContextAndConsult(
    @Body() body: any,
    @Headers() headers: any,
    @Req() request: Request
  ) {
    console.log("Datos recibidos en body:", JSON.stringify(body, null, 2));
    console.log("Headers recibidos:", JSON.stringify(headers, null, 2));
    
    let contextoTexto: string | null = null;
    
    // Extraer pregunta e idEmpleado de los headers
    const pregunta = headers['x-pregunta'] || headers['pregunta'];
    const idEmpleadoHeader = headers['x-id-empleado'] || headers['id-empleado'];
    const idEmpleado = body.idEmpleado || parseInt(idEmpleadoHeader) || 2723;
    
    // Si se proporciona contexto médico, guardarlo
    // El contexto puede venir en body.contextoMedico o directamente en body
    const contextoMedico = body.contextoMedico || body;
    if (contextoMedico && Object.keys(contextoMedico).length > 0) {
      const idEmpleadoContexto = this.contextService.guardarContexto(contextoMedico, idEmpleado);
      console.log(`Contexto guardado para empleado ID: ${idEmpleadoContexto}`);
      contextoTexto = this.contextService.obtenerContextoPorEmpleado(idEmpleadoContexto);
      console.log(`Contexto generado: ${contextoTexto}`);
    }
    
    // Si se proporciona una pregunta en los headers, procesarla
    if (pregunta) {
      // Si no se proporcionó contexto en esta petición, intentar obtenerlo por idEmpleado
      if (!contextoTexto) {
        contextoTexto = this.contextService.obtenerContextoPorEmpleado(idEmpleado);
      }
      
      const consultaDto = {
        pregunta: pregunta,
        idEmpleado: idEmpleado
      };
      
      console.log("Procesando consulta con contexto:", contextoTexto);
      const respuesta = await this.aymaraService.procesarConsulta(consultaDto, contextoTexto);
      
      return {
        message: (contextoMedico && Object.keys(contextoMedico).length > 0) ? "Contexto guardado y consulta procesada" : "Consulta procesada",
        respuesta: respuesta.respuesta,
        meta: respuesta.meta
      };
    }
    
    // Si solo se guardó contexto sin consulta
    if (contextoMedico && Object.keys(contextoMedico).length > 0) {
      return { message: "Se ha creado el contexto correctamente" };
    }

    return { message: "No se proporcionó contexto ni consulta para procesar" };
  }
  // @Post("limpiar-contexto")
  // @HttpCode(HttpStatus.OK)
  // async clearContext(@Req() request: Request) {
  //   this.contextService.clearContext(request);
  //   return { message: "Contexto eliminado correctamente" };
  // }
}
