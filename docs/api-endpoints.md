# Documentación de API AYMARA

Este documento describe los endpoints disponibles en la API AYMARA, su uso y ejemplos de solicitudes y respuestas.

## Base URL

Todos los endpoints están prefijados con `/api/v1`.

```
http://localhost:3000/api/v1
```

## Autenticación

La API no requiere autenticación, ya que es gestionada por otro backend.

## Endpoints

### Health Check

Verifica el estado de la API.

- **URL**: `/health`
- **Método**: `GET`
- **Autenticación**: No requerida

#### Respuesta

```json
{
  "status": "ok",
  "timestamp": "2023-07-01T12:00:00.000Z"
}
```

### Consulta a AYMARA

Envía una consulta a la IA AYMARA sobre temas del sistema de salud colombiano.

#### GET

- **URL**: `/aymara/consulta`
- **Método**: `GET`
- **Autenticación**: No requerida

##### Parámetros de consulta

```
/api/v1/aymara/consulta?pregunta=¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?&contexto=Soy un médico especialista&metadata={}
```

- `pregunta` (requerido): La consulta sobre el sistema de salud colombiano
- `contexto` (opcional): Información contextual adicional para enriquecer la respuesta
- `metadata` (opcional): Información adicional para contexto en formato JSON

#### POST

- **URL**: `/aymara/consulta`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Content-Type**: `application/json`

##### Cuerpo de la solicitud

```json
{
  "pregunta": "¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?",
  "contexto": "Soy un médico especialista que trabaja en una IPS de tercer nivel",
  "metadata": {}
}
```

- `pregunta` (requerido): La consulta sobre el sistema de salud colombiano
- `contexto` (opcional): Información contextual adicional para enriquecer la respuesta
- `metadata` (opcional): Información adicional para contexto en formato JSON

#### Respuesta exitosa

```json
{
  "respuesta": "Para radicar una factura a una EPS en Colombia necesita tener estos documentos al día: \n\n1. Factura electrónica que cumpla con requisitos de la DIAN.\n2. Detalle de cargos (discriminación de servicios).\n3. Copia de la autorización de servicios (si aplica).\n4. Soportes clínicos según el servicio prestado.\n5. RIPS (Registros Individuales de Prestación de Servicios) correctamente diligenciados.\n\nRecuerde que cada EPS puede tener requisitos adicionales específicos, por lo que es recomendable verificar con ellos antes de radicar.",
  "meta": {
    "tokens": 846
  }
}
```

#### Respuesta de error - Pregunta fuera de alcance

```json
{
  "statusCode": 400,
  "timestamp": "2023-07-01T12:00:00.000Z",
  "path": "/api/v1/aymara/consulta",
  "error": "Esta consulta no forma parte de mi campo de conocimiento.",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```



#### Respuesta de error - Error del servidor

```json
{
  "statusCode": 503,
  "timestamp": "2023-07-01T12:00:00.000Z",
  "path": "/api/v1/aymara/consulta",
  "error": "El servicio está experimentando alta demanda. Por favor, intenta más tarde.",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Ejemplos de uso

### Consulta GET con curl

```bash
curl -X GET "http://localhost:3000/api/v1/aymara/consulta?pregunta=¿Cuáles%20son%20los%20requisitos%20para%20radicar%20una%20factura%20a%20una%20EPS%20en%20Colombia?"
```

### Consulta POST con curl

```bash
curl -X POST "http://localhost:3000/api/v1/aymara/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "pregunta": "¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?",
    "contexto": "Soy un médico especialista que trabaja en una IPS de tercer nivel"
  }'
```

### Consulta GET con JavaScript (Fetch API)

```javascript
const pregunta = encodeURIComponent('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
const apiUrl = `http://localhost:3000/api/v1/aymara/consulta?pregunta=${pregunta}`;

fetch(apiUrl)
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Consulta POST con JavaScript (Fetch API)

```javascript
const apiUrl = 'http://localhost:3000/api/v1/aymara/consulta';
const data = {
  pregunta: '¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
  contexto: 'Soy un médico especialista que trabaja en una IPS de tercer nivel'
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Consulta GET con Python (Requests)

```python
import requests
from urllib.parse import quote

pregunta = quote('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?')
api_url = f'http://localhost:3000/api/v1/aymara/consulta?pregunta={pregunta}'

response = requests.get(api_url)
print(response.json())
```

### Consulta POST con Python (Requests)

```python
import requests
import json

api_url = 'http://localhost:3000/api/v1/aymara/consulta'
data = {
    'pregunta': '¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?',
    'contexto': 'Soy un médico especialista que trabaja en una IPS de tercer nivel'
}

response = requests.post(api_url, json=data)
print(response.json())
```

## Notas importantes

1. La API está diseñada para responder preguntas específicas sobre el sistema de salud colombiano.
2. Las preguntas fuera del ámbito de conocimiento de AYMARA serán rechazadas con un error 400.
3. Cada solicitud incluye un `requestId` único que puede ser utilizado para seguimiento y depuración.
4. La API implementa rate limiting para prevenir abusos (30 solicitudes por minuto).
5. La autenticación es manejada por otro backend, por lo que no se requiere API key en esta implementación.
6. En entornos de producción, asegúrate de usar HTTPS para proteger la información transmitida.