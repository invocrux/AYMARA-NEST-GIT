import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateConsultaDto } from "./dto/create-consulta.dto";
import OpenAI from "openai";

@Injectable()
export class AymaraService {
  private readonly logger = new Logger(AymaraService.name);
  private readonly openai: OpenAI;
  private readonly SYSTEM_MESSAGE: string;

  // Listas para filtrado de preguntas
  private readonly PALABRAS_CLAVE_PERMITIDAS: string[] = [
    "salud",
    "colombia",
    "eps",
    "ips",
    "rips",
    "facturación",
    "glosa",
    "auditoría",
    "pqrd",
    "tarifario",
    "médico",
    "clínico",
    "administrativo",
    "normativa",
    "ley",
    "decreto",
    "resolución",
    "circular",
    "sistema",
    "paciente",
    "usuario",
    "afiliado",
    "prestador",
    "servicio",
    "atención",
    "procedimiento",
    "diagnóstico",
  ];

  private readonly PALABRAS_CLAVE_PROHIBIDAS: string[] = [
    "política",
    "religión",
    "sexo",
    "pornografía",
    "drogas",
    "ilegal",
    "hackear",
    "crimen",
    "terrorismo",
    "violencia",
    "armas",
    "discriminación",
    "racismo",
    "xenofobia",
    "homofobia",
    "transfobia",
    "misoginia",
    "suicidio",
    "autolesión",
  ];

  constructor(private readonly configService: ConfigService) {
    // Inicializar cliente de OpenAI
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error(
        "API_KEY no está configurada en las variables de entorno"
      );
    }

    this.openai = new OpenAI({
      apiKey,
    });

    // Mensaje del sistema para AYMARA
    this.SYSTEM_MESSAGE = `
Eres AYMARA, una inteligencia artificial médico-administrativa creada para asistir en temas del sistema de salud colombiano. 
Tu conocimiento y capacidades se centran en: 

- Normas, leyes, decretos y reglamentaciones del sistema de salud en Colombia. 
- Procesos administrativos y clínicos: RIPS, facturación, glosas, auditorías, PQRD, manual tarifario. 
- Procedimientos médicos y administrativos, siempre con base en fuentes oficiales y actualizadas. 
- Uso de lenguaje claro, directo y con tono costeño (Barranquilla), pero manteniendo profesionalismo. 

Reglas y estilo de respuesta: 
1. No responder temas fuera de medicina, administración en salud, leyes o normativas del sector salud colombiano. 
   - Si el usuario pregunta algo fuera de tu alcance, responde: 
     "Esa pregunta no hace parte de mi campo de conocimiento, compa." 
2. Prioriza la precisión sobre la extensión: responde de forma breve pero completa. 
3. Usa ejemplos prácticos y aplicables a la realidad colombiana. 
4. Mantén un tono cálido y cercano, propio de la costa, sin perder seriedad. 
5. Si no tienes datos suficientes para responder con seguridad, indícalo y sugiere una fuente oficial. 

Formato de respuesta: 
- Introducción breve (máx. 1 línea). 
- Explicación clara y puntual. 
- Si aplica, lista numerada o en viñetas para facilitar lectura. 
- Referencias o normativa relacionada (cuando sea relevante). 

Recuerda: siempre actúas como AYMARA, nunca como ChatGPT ni como otro asistente. 
`;
  }

  /**
   * Procesa una consulta para AYMARA
   */
  async procesarConsulta(createConsultaDto: CreateConsultaDto) {
    const { pregunta, metadata } = createConsultaDto;

    // Registrar la consulta en logs
    this.logger.log(`Nueva consulta recibida: ${pregunta}`);

    // Validar si la pregunta está dentro del alcance
    if (!this.esPreguntaValida(pregunta)) {
      this.logger.warn(`Pregunta fuera de alcance rechazada: ${pregunta}`);
      throw new BadRequestException({
        error: "Esa pregunta no hace parte de mi campo de conocimiento, compa.",
      });
    }

    try {
      // Preparar mensajes para OpenAI
      const messages = [
        { role: "system", content: this.SYSTEM_MESSAGE },
        { role: "user", content: pregunta },
      ];

      // Obtener configuración de OpenAI
      const model =
        this.configService.get<string>("DEFAULT_MODEL") || "gpt-4-turbo";
      const temperature = parseFloat(
        this.configService.get<string>("DEFAULT_TEMPERATURE") || "0.3"
      );

      // Llamar a la API de OpenAI
      const completion = await this.openai.chat.completions.create({
        model,
        messages: messages as any,
        temperature,
      });

      // Extraer la respuesta
      const respuesta =
        completion.choices[0]?.message?.content ||
        "Lo siento, no pude procesar tu consulta.";

      // Preparar respuesta con metadatos
      return {
        respuesta,
        meta: {
          tokens: completion.usage?.total_tokens || null,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error al procesar consulta: ${errorMessage}`,
        errorStack
      );

      // Manejar errores específicos
      if (error instanceof Error && "status" in error && error.status === 429) {
        throw new ServiceUnavailableException(
          "El servicio está experimentando alta demanda. Por favor, intenta más tarde."
        );
      }

      throw new ServiceUnavailableException(
        "Ocurrió un error al procesar tu consulta. Por favor, intenta más tarde."
      );
    }
  }

  /**
   * Valida si una pregunta está dentro del alcance de AYMARA
   */
  private esPreguntaValida(pregunta: string): boolean {
    const preguntaNormalizada = pregunta.toLowerCase();

    // Verificar palabras prohibidas
    const contienePalabraProhibida = this.PALABRAS_CLAVE_PROHIBIDAS.some(
      (palabra) => preguntaNormalizada.includes(palabra.toLowerCase())
    );

    if (contienePalabraProhibida) {
      return false;
    }

    // Verificar palabras permitidas
    const contienePalabraPermitida = this.PALABRAS_CLAVE_PERMITIDAS.some(
      (palabra) => preguntaNormalizada.includes(palabra.toLowerCase())
    );

    if (contienePalabraPermitida) {
      return true;
    }

    // Fallback: verificar longitud y que esté en español
    // Una heurística simple: si la pregunta es corta y contiene caracteres españoles
    const esEspanol = /[áéíóúñ¿¡]/i.test(preguntaNormalizada);
    const longitudAdecuada = pregunta.length > 10 && pregunta.length < 500;

    return esEspanol && longitudAdecuada;
  }
}
