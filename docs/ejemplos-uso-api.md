# Ejemplos de Uso de la API AYMARA

Este documento proporciona ejemplos prácticos para interactuar con la API AYMARA en diferentes lenguajes de programación.

## Configuración previa

Antes de ejecutar cualquier ejemplo, asegúrate de tener:

1. La API AYMARA corriendo (local o en producción)
2. La URL base correcta (por defecto: `http://localhost:3000/api/v1`)

Nota: La autenticación es manejada por otro backend, por lo que no se requiere API key en esta implementación.

## Ejemplos por lenguaje

### cURL (Línea de comandos)

#### Verificar estado de la API

```bash
curl -X GET http://localhost:3000/api/v1/health
```

#### Realizar una consulta a AYMARA

```bash
curl -X GET "http://localhost:3000/api/v1/aymara/consulta?pregunta=¿Cuáles%20son%20los%20requisitos%20para%20radicar%20una%20factura%20a%20una%20EPS%20en%20Colombia?"
```

### JavaScript (Node.js)

#### Usando Fetch API

```javascript
// Consulta a AYMARA usando Fetch API
async function consultarAymara() {
  const pregunta = encodeURIComponent('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
  const apiUrl = `http://localhost:3000/api/v1/aymara/consulta?pregunta=${pregunta}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return;
    }
    
    const data = await response.json();
    console.log('Respuesta:', data.respuesta);
    console.log('Tokens utilizados:', data.meta.tokens);
    return data;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

consultarAymara();
```

#### Usando Axios

```javascript
// Instalar primero: npm install axios
const axios = require('axios');

async function consultarAymara() {
  const pregunta = encodeURIComponent('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
  const apiUrl = `http://localhost:3000/api/v1/aymara/consulta?pregunta=${pregunta}`;
  
  try {
    const response = await axios.get(apiUrl);
    
    console.log('Respuesta:', response.data.respuesta);
    console.log('Tokens utilizados:', response.data.meta.tokens);
  } catch (error) {
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado
      console.error('Error:', error.response.data);
    } else {
      console.error('Error de conexión:', error.message);
    }
  }
}

consultarAymara();
```

### Python

#### Usando Requests

```python
# Instalar primero: pip install requests
import requests
from urllib.parse import quote

def consultar_aymara():
    pregunta = quote('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?')
    api_url = f'http://localhost:3000/api/v1/aymara/consulta?pregunta={pregunta}'
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        result = response.json()
        print(f"Respuesta: {result['respuesta']}")
        print(f"Tokens utilizados: {result['meta']['tokens']}")
    except requests.exceptions.HTTPError as err:
        print(f"Error HTTP: {err}")
        print(f"Detalles: {response.json()}")
    except requests.exceptions.RequestException as err:
        print(f"Error de conexión: {err}")

if __name__ == "__main__":
    consultar_aymara()
```

### PHP

```php
<?php
// Consulta a AYMARA usando cURL en PHP
function consultarAymara() {
    $pregunta = urlencode('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
    $apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta={$pregunta}";
    
    $ch = curl_init($apiUrl);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch);
        return;
    }
    
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($httpCode >= 400) {
        echo 'Error: ' . $result['error'] . "\n";
        echo 'Código: ' . $result['statusCode'] . "\n";
        echo 'ID de solicitud: ' . $result['requestId'] . "\n";
        return;
    }
    
    echo 'Respuesta: ' . $result['respuesta'] . "\n";
    echo 'Tokens utilizados: ' . $result['meta']['tokens'] . "\n";
}

consultarAymara();
?>
```

### Java

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

// Necesitarás una biblioteca para manejar JSON como Jackson o Gson
// Este ejemplo usa la API HttpClient de Java 11+

public class AymaraClient {
    
    public static void main(String[] args) {
        consultarAymara();
    }
    
    public static void consultarAymara() {
        try {
            String pregunta = java.net.URLEncoder.encode("¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?", "UTF-8");
            String apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta=" + pregunta;
            
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .GET()
                    .build();
        
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            int statusCode = response.statusCode();
            String body = response.body();
            
            if (statusCode >= 400) {
                System.out.println("Error: " + statusCode);
                System.out.println("Respuesta: " + body);
                return;
            }
            
            System.out.println("Respuesta exitosa: " + body);
            // Aquí deberías parsear el JSON para extraer respuesta y tokens
            
        } catch (IOException | InterruptedException e) {
            System.err.println("Error de conexión: " + e.getMessage());
        }
    }
}
```

## Manejo de errores

Todos los ejemplos anteriores incluyen manejo básico de errores. Recuerda que la API puede devolver diferentes códigos de estado:

- **200**: Solicitud exitosa
- **400**: Error de solicitud (pregunta fuera de alcance, formato inválido)
- **429**: Demasiadas solicitudes (rate limiting)
- **503**: Servicio no disponible (error en la API de OpenAI o sobrecarga)

Cada respuesta de error incluye:
- `statusCode`: Código HTTP del error
- `timestamp`: Momento exacto del error
- `path`: Ruta de la solicitud
- `error`: Mensaje descriptivo del error
- `requestId`: Identificador único para seguimiento

## Recomendaciones

1. **Siempre maneja los errores** adecuadamente en tu aplicación
2. **Implementa reintentos** para errores 429 y 503 con espera exponencial
3. **Almacena el requestId** para facilitar la depuración
4. **Protege tu API key** y no la incluyas en código cliente expuesto
5. **Usa HTTPS** en producción para proteger la información transmitida