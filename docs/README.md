# Documentación de la API AYMARA

Este directorio contiene la documentación técnica y de uso de la API AYMARA, un backend NestJS para consultas sobre el sistema de salud colombiano.

## Contenido

### 1. [API Endpoints](./api-endpoints.md)

Documentación detallada de los endpoints disponibles en la API, incluyendo:
- Rutas y métodos
- Parámetros requeridos
- Formato de respuestas
- Códigos de estado
- Ejemplos de solicitudes y respuestas

### 2. [Ejemplos de Uso](./ejemplos-uso-api.md)

Ejemplos prácticos de cómo consumir la API desde diferentes lenguajes de programación:
- cURL (línea de comandos)
- JavaScript (Node.js)
- Python
- PHP
- Java

Incluye manejo de errores y recomendaciones de implementación.

### 3. [Arquitectura Técnica](./arquitectura-tecnica.md)

Descripción detallada de la arquitectura de la aplicación:
- Estructura del proyecto
- Componentes principales
- Flujo de datos
- Configuración y despliegue
- Consideraciones de seguridad
- Escalabilidad y extensibilidad

## Uso rápido

Para comenzar a utilizar la API AYMARA:

1. Asegúrate de tener la API corriendo (local o en producción)
2. Obtén una clave API válida (configurada en la variable de entorno `INTERNAL_API_KEY`)
3. Consulta [API Endpoints](./api-endpoints.md) para conocer los endpoints disponibles
4. Revisa [Ejemplos de Uso](./ejemplos-uso-api.md) para implementar la integración en tu lenguaje preferido

## Notas importantes

- La API está diseñada para responder preguntas específicas sobre el sistema de salud colombiano
- Todas las solicitudes (excepto health check) requieren autenticación mediante API Key
- La API implementa rate limiting para prevenir abusos (30 solicitudes por minuto)
- En entornos de producción, asegúrate de usar HTTPS para proteger la información transmitida