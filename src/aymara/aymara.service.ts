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
  // Ya no usamos lista de palabras permitidas, confiamos en el modelo para determinar si la pregunta está en su dominio

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
- Procedimientos médicos y administrativos, incluyendo scores médicos (como Apache, SOFA, Glasgow, etc.), protocolos clínicos y guías de práctica clínica.
- Cálculos y evaluaciones médicas utilizadas en el contexto clínico colombiano.
- Uso de lenguaje claro, directo y neutro, manteniendo profesionalismo. 

Reglas y estilo de respuesta: 
1. No responder temas fuera de medicina, administración en salud, leyes o normativas del sector salud colombiano. 
   - Si el usuario pregunta algo fuera de tu alcance, responde: 
     "Esta consulta no forma parte de mi campo de conocimiento." 
2. Prioriza la precisión sobre la extensión: responde de forma breve pero completa. 
3. Usa ejemplos prácticos y aplicables a la realidad colombiana. 
4. Mantén un tono profesional y neutro. 
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
    const { pregunta, contexto, metadata } = createConsultaDto;

    // Registrar la consulta en logs
    this.logger.log(`Nueva consulta recibida: ${pregunta}`);
    if (contexto) {
      this.logger.log(
        `Contexto adicional proporcionado: ${contexto.substring(0, 100)}${contexto.length > 100 ? "..." : ""}`
      );
    }

    // Validar si la pregunta está dentro del alcance
    if (!this.esPreguntaValida(pregunta)) {
      this.logger.warn(`Pregunta fuera de alcance rechazada: ${pregunta}`);
      throw new BadRequestException({
        error: "Esta consulta no forma parte de mi campo de conocimiento.",
      });
    }

    try {
      // Preparar mensajes para OpenAI
      const messages = [{ role: "system", content: this.SYSTEM_MESSAGE }];

      // Añadir contexto si está presente
      this.logger.log(`Contexto adicional proporcionado: ${contexto}`);

      if (contexto) {
        messages.push({
          role: "system",
          content: `Contexto adicional para responder: ${contexto}`,
        });
      }

      // Añadir la pregunta del usuario
      messages.push({ role: "user", content: pregunta });

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
   * Valida si una pregunta o solicitud está dentro del alcance de AYMARA
   * Solo filtra palabras prohibidas y verifica coherencia básica
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

    // Verificar coherencia básica: longitud adecuada y que esté en español
    const esEspanol =
      /[áéíóúñ¿¡]/i.test(preguntaNormalizada) ||
      /\b(que|como|cual|donde|quien|por|para|cuando)\b/i.test(
        preguntaNormalizada
      );
    const longitudAdecuada = pregunta.length >= 3 && pregunta.length < 1000;

    // Verificar si es una pregunta o una solicitud relacionada con el ámbito médico
    const tieneEstructuraPregunta =
      pregunta.includes("?") ||
      /\b(qu[eé]|c[oó]mo|cu[aá]l|d[oó]nde|qui[eé]n|cu[aá]ndo|cu[aá]nto|por qu[eé])\b/i.test(
        preguntaNormalizada
      );

    // Verificar si es una solicitud relacionada con el ámbito médico-administrativo
    const esSolicitudMedica =
      /\b(medic[oa]|paciente|resumen|historia|clínic[oa]|salud|eps|ips|hospital|consulta|tratamiento|diagnóstico|factura|glosa|rips|pqrd|auditoría)\b/i.test(
        preguntaNormalizada
      );

    // Verificar si es una solicitud explícita de información
    const esSolicitudExplicita =
      /\b(necesito|requiero|solicito|dame|proporciona|explica|ayuda|información)\b/i.test(
        preguntaNormalizada
      );

    // Si la entrada es coherente (español + longitud adecuada) y es una pregunta o solicitud médica, la aceptamos
    return (
      longitudAdecuada &&
      esEspanol &&
      (tieneEstructuraPregunta || esSolicitudMedica || esSolicitudExplicita)
    );
  }
}
