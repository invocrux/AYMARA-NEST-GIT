# Guía de Despliegue en Render

Este documento proporciona instrucciones paso a paso para desplegar la API AYMARA en [Render](https://render.com), un servicio de hosting en la nube.

## Requisitos Previos

1. Una cuenta en [Render](https://render.com)
2. Tu repositorio de código en GitHub, GitLab o Bitbucket
3. Una clave API de OpenAI (para la funcionalidad de AYMARA)

## Pasos para el Despliegue

### 1. Preparación del Proyecto

Asegúrate de que tu proyecto incluya los siguientes archivos necesarios para el despliegue:

- `package.json` con los scripts necesarios:
  ```json
  "scripts": {
    "build": "nest build",
    "start": "node dist/main.js"
  }
  ```
- `Dockerfile` (opcional, si prefieres despliegue con Docker)
- `.env.example` con todas las variables de entorno requeridas

### 2. Crear un Nuevo Servicio Web en Render

1. Inicia sesión en tu cuenta de Render
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio de la API AYMARA

### 3. Configurar el Servicio

Completa la configuración con los siguientes valores:

- **Nombre**: `aymara-api` (o el nombre que prefieras)
- **Región**: Selecciona la más cercana a tus usuarios (por ejemplo, `Ohio (US East)` para usuarios en América)
- **Branch**: `main` (o la rama que desees desplegar)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 4. Configurar Variables de Entorno

Haz clic en "Advanced" y añade las siguientes variables de entorno:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render asignará automáticamente el puerto)
- `OPENAI_API_KEY`: Tu clave API de OpenAI
- `THROTTLE_TTL`: `60` (o el valor que prefieras para rate limiting)
- `THROTTLE_LIMIT`: `30` (o el valor que prefieras para rate limiting)

### 5. Seleccionar Plan y Recursos

- Para desarrollo/pruebas: Plan gratuito
- Para producción: Plan "Starter" o superior según tus necesidades de tráfico

### 6. Crear el Servicio

Haz clic en "Create Web Service". Render comenzará a construir y desplegar tu aplicación.

## Verificación del Despliegue

Una vez completado el despliegue, puedes verificar que tu API esté funcionando correctamente:

1. Visita la URL proporcionada por Render (por ejemplo, `https://aymara-api.onrender.com`)
2. Prueba el endpoint de salud: `https://aymara-api.onrender.com/api/v1/health`
3. Realiza una consulta de prueba:
   ```
   https://aymara-api.onrender.com/api/v1/aymara/consulta?pregunta=¿Qué es el POS en Colombia?
   ```

## Configuración Adicional (Opcional)

### Dominio Personalizado

Si deseas usar un dominio personalizado:

1. En el panel de tu servicio, ve a "Settings" > "Custom Domain"
2. Sigue las instrucciones para configurar los registros DNS

### Escalado Automático

Para servicios en planes de pago:

1. Ve a "Settings" > "Autoscaling"
2. Configura las reglas de escalado según tus necesidades

## Solución de Problemas

### Logs y Monitoreo

Para diagnosticar problemas:

1. Ve a la pestaña "Logs" en el panel de tu servicio
2. Filtra por nivel de log (info, error, etc.)

### Problemas Comunes

- **Error de construcción**: Verifica que los scripts en `package.json` sean correctos
- **Error en tiempo de ejecución**: Revisa las variables de entorno y los logs
- **Problemas de rendimiento**: Considera actualizar a un plan con más recursos

## Mantenimiento

### Actualizaciones

Para actualizar tu aplicación:

1. Haz push de tus cambios al repositorio
2. Render detectará automáticamente los cambios y desplegará la nueva versión

### Rollback

Para revertir a una versión anterior:

1. Ve a "Deploys" en el panel de tu servicio
2. Encuentra la versión a la que deseas revertir
3. Haz clic en "Rollback to this deploy"

## Consideraciones de Seguridad

- Render proporciona HTTPS por defecto
- Considera implementar medidas adicionales como CORS configurado correctamente
- Nunca expongas claves API o secretos en el código fuente

## Costos y Optimización

- Los servicios gratuitos de Render se pausan después de períodos de inactividad
- Para servicios de producción, considera los planes de pago que ofrecen disponibilidad continua
- Monitorea el uso de recursos para optimizar costos

---

Para más información, consulta la [documentación oficial de Render](https://render.com/docs).