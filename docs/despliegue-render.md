# Guía de Despliegue en Render

Este documento proporciona instrucciones paso a paso para desplegar la API AYMARA en [Render](https://render.com), un servicio de hosting en la nube.

## Requisitos Previos

1. Una cuenta en [Render](https://render.com)
2. Tu repositorio de código en GitHub, GitLab o Bitbucket
3. Una clave API de OpenAI (para la funcionalidad de AYMARA)

## Métodos de Despliegue

Hay dos formas principales de desplegar la API AYMARA en Render:

1. **Despliegue usando Blueprint** (recomendado): Utiliza el archivo `render.yaml` para configurar y desplegar todos los servicios necesarios en un solo paso.
2. **Despliegue manual**: Configura manualmente cada servicio a través del Dashboard de Render.

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
- `render.yaml` (para despliegue usando Blueprint)
- `.env.example` con todas las variables de entorno requeridas

### 2. Opción A: Despliegue usando Blueprint (Recomendado)

1. Inicia sesión en tu cuenta de Render
2. Haz clic en "New +" y selecciona "Blueprint"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio que contiene el archivo `render.yaml`
5. Revisa la configuración que se aplicará (servicios, variables de entorno, etc.)
6. Haz clic en "Apply" para iniciar el despliegue

> **Nota**: El archivo `render.yaml` ya contiene toda la configuración necesaria, incluyendo nombre del servicio, comandos de construcción y ejecución, variables de entorno, etc.

### 2. Opción B: Despliegue Manual

1. Inicia sesión en tu cuenta de Render
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio de la API AYMARA

#### Configurar el Servicio Manualmente

Completa la configuración con los siguientes valores:

- **Nombre**: `aymara-api` (o el nombre que prefieras)
- **Región**: Selecciona la más cercana a tus usuarios (por ejemplo, `Ohio (US East)` para usuarios en América)
- **Branch**: `main` (o la rama que desees desplegar)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

#### Configurar Variables de Entorno Manualmente

Haz clic en "Advanced" y añade las siguientes variables de entorno:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render asignará automáticamente el puerto)
- `OPENAI_API_KEY`: Tu clave API de OpenAI
- `THROTTLE_TTL`: `60` (o el valor que prefieras para rate limiting)
- `THROTTLE_LIMIT`: `30` (o el valor que prefieras para rate limiting)
- `CORS_ORIGINS`: Lista de orígenes permitidos separados por comas (ejemplo: `http://localhost:8100,http://localhost:3000,https://tu-frontend.com`). **Importante**: Asegúrate de incluir todos los dominios desde los que se accederá a la API, incluyendo entornos de desarrollo.

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
- **Errores CORS**: Con la configuración actual, no deberías experimentar errores CORS ya que la API permite solicitudes desde cualquier origen. Sin embargo, si aún experimentas problemas:
  1. Verifica que la configuración en `main.ts` esté correctamente aplicada con `origin: '*'`
  2. Asegúrate de que el despliegue más reciente se haya completado en Render (puede tomar unos minutos)
  3. Revisa los logs de la aplicación para verificar que la configuración CORS se está aplicando correctamente
  4. Si necesitas implementar restricciones de CORS en el futuro, modifica la configuración en `main.ts` y vuelve a desplegar la aplicación

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
- **Configuración CORS**: La API ahora implementa CORS para permitir acceso desde cualquier origen:
  - La configuración actual permite solicitudes desde cualquier dominio (`origin: '*'`)
  - No es necesario configurar la variable `CORS_ORIGINS` ya que se ha eliminado esta restricción
  - Esta configuración facilita la integración con cualquier frontend, pero considera implementar restricciones más específicas en entornos de alta seguridad
- Nunca expongas claves API o secretos en el código fuente
- La API implementa rate limiting para proteger contra ataques de fuerza bruta

## Costos y Optimización

- Los servicios gratuitos de Render se pausan después de períodos de inactividad
- Para servicios de producción, considera los planes de pago que ofrecen disponibilidad continua
- Monitorea el uso de recursos para optimizar costos

---

Para más información, consulta la [documentación oficial de Render](https://render.com/docs).