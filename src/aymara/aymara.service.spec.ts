import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { AymaraService } from './aymara.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

// Mock de OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Respuesta de prueba' } }],
            usage: { total_tokens: 100 },
          }),
        },
      },
    })),
  };
});

describe('AymaraService', () => {
  let service: AymaraService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AymaraService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'OPENAI_API_KEY':
                  return 'test-openai-key';
                case 'DEFAULT_MODEL':
                  return 'gpt-4-turbo';
                case 'DEFAULT_TEMPERATURE':
                  return '0.3';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AymaraService>(AymaraService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('procesarConsulta', () => {
    it('should process a valid query and return a response', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
      };

      const result = await service.procesarConsulta(consultaDto);

      expect(result).toHaveProperty('respuesta');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('tokens');
      expect(result.respuesta).toBe('Respuesta de prueba');
    });

    it('should process a query with context and return a response', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
        contexto: 'Soy un médico especialista que trabaja en una IPS de tercer nivel',
      };

      const result = await service.procesarConsulta(consultaDto);

      expect(result).toHaveProperty('respuesta');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('tokens');
      expect(result.respuesta).toBe('Respuesta de prueba');
    });

    it('should accept any query after removing restrictions', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cómo hackear una cuenta de Facebook?',
      };

      // Ahora todas las consultas son aceptadas
      const result = await service.procesarConsulta(consultaDto);
      expect(result).toHaveProperty('respuesta');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('tokens');
      expect(result.respuesta).toBe('Respuesta de prueba');
    });

    it('should handle OpenAI API errors gracefully', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
      };

      // Crear un nuevo servicio con un mock que lance error
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue({
              status: 429,
              message: 'Rate limit exceeded',
            }),
          },
        },
      };
      
      // Reemplazar la instancia de OpenAI en el servicio
      (service as any).openai = mockOpenAI;

      await expect(service.procesarConsulta(consultaDto)).rejects.toThrow(ServiceUnavailableException);
    });
  });

  // Test privado usando cualquier para acceder al método privado
  // Las pruebas de validación de preguntas han sido eliminadas ya que
  // el método esPreguntaValida() ha sido removido y ya no se realizan
  // validaciones temáticas en las consultas
});