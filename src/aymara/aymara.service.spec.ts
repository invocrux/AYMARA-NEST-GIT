import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { AymaraService } from './aymara.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

// Mock de OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Respuesta de prueba' } }],
          usage: { total_tokens: 100 },
        }),
      },
    },
  }));
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

    it('should reject a query outside the scope', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cómo hackear una cuenta de Facebook?',
      };

      await expect(service.procesarConsulta(consultaDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle OpenAI API errors gracefully', async () => {
      const consultaDto: CreateConsultaDto = {
        pregunta: 'Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
      };

      // Mock para simular un error de la API
      const openaiMock = require('openai');
      openaiMock.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue({
              status: 429,
              message: 'Rate limit exceeded',
            }),
          },
        },
      }));

      await expect(service.procesarConsulta(consultaDto)).rejects.toThrow(ServiceUnavailableException);
    });
  });

  // Test privado usando cualquier para acceder al método privado
  describe('esPreguntaValida', () => {
    it('should accept valid health-related questions', () => {
      const result = (service as any).esPreguntaValida('¿Cómo funciona el proceso de facturación en el sistema de salud colombiano?');
      expect(result).toBe(true);
    });

    it('should reject questions with prohibited keywords', () => {
      const result = (service as any).esPreguntaValida('¿Cómo puedo hackear el sistema de una EPS?');
      expect(result).toBe(false);
    });

    it('should use fallback for ambiguous questions in Spanish', () => {
      const result = (service as any).esPreguntaValida('¿Qué debo hacer si tengo una duda médica?');
      expect(result).toBe(true);
    });
  });
});