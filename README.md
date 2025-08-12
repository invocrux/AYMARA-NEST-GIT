# AYMARA API - Backend NestJS

Backend seguro y listo para producción para servir a la IA "AYMARA", especializada en el sistema de salud colombiano.

## Características

- Endpoint seguro para consultas a AYMARA
- Integración con OpenAI
- Filtrado de preguntas fuera de alcance
- Seguridad con rate limiting, Helmet y CORS
- Logging con requestId
- Manejo centralizado de errores
- Despliegue automatizado en Render

## Requisitos

- Node.js >= 18
- npm o yarn

## Instalación

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd aymara-nest
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus propias credenciales:

```
OPENAI_API_KEY=tu_api_key_de_openai
DEFAULT_MODEL=gpt-4-turbo
DEFAULT_TEMPERATURE=0.3
# CORS está configurado para permitir cualquier origen en main.ts
PORT=3000
NODE_ENV=development
THROTTLE_TTL=60
THROTTLE_LIMIT=30
```

## Ejecución

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## Uso

### Ejemplo de consulta con curl

```bash
curl -X GET "http://localhost:3000/api/v1/aymara/consulta?pregunta=%C2%BFCu%C3%A1les%20son%20los%20requisitos%20para%20radicar%20una%20factura%20a%20una%20EPS%20en%20Colombia%3F"
```

### Respuesta esperada

```json
{
  "respuesta": "¡Qué más vale! Para radicar una factura a una EPS en Colombia necesitas tener estos documentos al día, compa: \n\n1. Factura electrónica que cumpla con requisitos de la DIAN.\n2. Detalle de cargos (discriminación de servicios).\n3. Copia de la autorización de servicios (si aplica).\n4. Soportes clínicos: historia clínica, notas de enfermería, etc.\n5. RIPS (Registros Individuales de Prestación de Servicios) correctamente diligenciados.\n6. Evidencia de verificación de derechos del usuario.\n\nRecuerda que según la Resolución 3047 de 2008 y sus modificaciones, tienes 6 meses para radicar desde la fecha de prestación del servicio. ¡Pilas con eso!",
  "meta": {
    "tokens": 846
  }
}
```

## Despliegue en Render

Este proyecto está configurado para un despliegue sencillo en Render:

1. Usando el Blueprint (recomendado):

```bash
# Instalar render-cli si no está instalado
npm install -g @render/cli

# Iniciar sesión en Render
render login

# Desplegar usando el blueprint
render blueprint apply
```

O ejecuta el script de despliegue incluido:

```bash
chmod +x ./scripts/deploy-render.sh
./scripts/deploy-render.sh
```

2. Despliegue manual:

Sigue las instrucciones detalladas en [docs/despliegue-render.md](./docs/despliegue-render.md)

## Notas de Seguridad

- Nunca subas el archivo `.env` al repositorio
- Configura correctamente los orígenes permitidos en CORS_ORIGINS
- Ajusta los valores de THROTTLE_TTL y THROTTLE_LIMIT según tus necesidades de rate limiting
- Utiliza HTTPS en producción
- Protege tu clave de OpenAI y nunca la expongas en el código cliente

## Estructura del Proyecto

```
src/
├── aymara/
│   ├── dto/
│   │   └── create-consulta.dto.ts
│   ├── aymara.controller.ts
│   ├── aymara.module.ts
│   └── aymara.service.ts
├── common/
│   ├── controllers/
│   │   └── health.controller.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── all-exceptions.filter.ts
│   └── interceptors/
│       └── logging.interceptor.ts
├── app.module.ts
└── main.ts
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](./LICENSE) para más detalles.

## Contribuir

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](./CONTRIBUTING.md) para obtener detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.