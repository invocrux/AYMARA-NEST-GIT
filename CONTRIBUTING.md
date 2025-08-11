# Guía de Contribución para AYMARA API

## Introducción

Gracias por considerar contribuir al proyecto AYMARA API. Este documento proporciona las directrices para contribuir a este proyecto.

## Flujo de Trabajo con Git

1. **Fork del repositorio**: Crea un fork del repositorio en tu cuenta de GitHub.

2. **Clona tu fork**: 
   ```bash
   git clone https://github.com/TU_USUARIO/AYMARA-NEST.git
   cd AYMARA-NEST
   ```

3. **Configura el repositorio upstream**:
   ```bash
   git remote add upstream https://github.com/REPOSITORIO_ORIGINAL/AYMARA-NEST.git
   ```

4. **Crea una rama para tu contribución**:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

5. **Realiza tus cambios y haz commits**:
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   ```

6. **Mantén tu rama actualizada**:
   ```bash
   git pull upstream main
   ```

7. **Sube tus cambios**:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

8. **Crea un Pull Request** desde tu rama hacia la rama principal del repositorio original.

## Estándares de Código

- Usa TypeScript estricto (`"strict": true` en tsconfig).
- Sigue las convenciones de nombres de NestJS.
- Documenta las funciones públicas con comentarios JSDoc.
- Escribe tests unitarios para nuevas funcionalidades.
- Asegúrate de que tu código pase el linting y los tests antes de enviar un PR.

## Estructura del Proyecto

Mantén la estructura modular de NestJS:

- Cada funcionalidad debe vivir en su propio módulo.
- Los servicios deben ser independientes de los controladores.
- Usa DTOs para validación de datos.
- Implementa interfaces para definir contratos claros.

## Proceso de Pull Request

1. Asegúrate de que tu PR resuelve un issue específico o implementa una mejora clara.
2. Incluye una descripción detallada de los cambios.
3. Asegúrate de que todos los tests pasen.
4. Solicita revisión de al menos un miembro del equipo.

## Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

- Descripción clara del problema.
- Pasos para reproducirlo.
- Comportamiento esperado vs. comportamiento actual.
- Capturas de pantalla si aplica.
- Información del entorno (sistema operativo, versión de Node.js, etc.).

## Sugerir Mejoras

Para sugerir mejoras, crea un issue con:

- Descripción clara de la mejora.
- Justificación (¿por qué es necesaria?).
- Posible implementación si la tienes.

## Configuración del Entorno de Desarrollo

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Configura las variables de entorno según tus necesidades.

4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

## Ejecutar Tests

```bash
# tests unitarios
npm run test

# tests e2e
npm run test:e2e

# cobertura de tests
npm run test:cov
```

## Contacto

Si tienes preguntas o necesitas ayuda, puedes contactar al equipo a través de:

- Issues de GitHub
- Email: backend@aymara.ai

¡Gracias por contribuir a AYMARA API!