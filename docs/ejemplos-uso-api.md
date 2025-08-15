# Ejemplos de Uso de la API AYMARA

Este documento proporciona ejemplos prácticos para interactuar con la API AYMARA en diferentes lenguajes de programación.

> **NUEVO**: Ahora puedes establecer el contexto una vez y realizar múltiples consultas utilizando ese contexto almacenado en sesión.

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

#### Realizar una consulta a AYMARA (GET)

```bash
curl -X GET "http://localhost:3000/api/v1/aymara/consulta?pregunta=¿Cuáles%20son%20los%20requisitos%20para%20radicar%20una%20factura%20a%20una%20EPS%20en%20Colombia?"
```

#### Realizar una consulta a AYMARA (método anterior - OBSOLETO)

> **NOTA**: Este método ya no está disponible. Por favor, utiliza el método de establecer contexto y luego realizar consultas GET.
```

#### Establecer contexto médico para consultas posteriores

```bash
curl -X POST "http://localhost:3000/api/v1/aymara/contexto" \
  -H "Content-Type: application/json" \
  -d '{
    "contextoMedico": {
      "paciente": {
        "nombre": "Juan Pérez",
        "identificacion": "12345678",
        "edad": 45,
        "sexo": "masculino"
      },
      "idEmpleado": 2723
    }
  }'
```

#### Realizar consulta con contexto previamente guardado

```bash
curl -X POST "http://localhost:3000/api/v1/aymara/contexto" \
  -H "Content-Type: application/json" \
  -d '{
    "pregunta": "¿Cuáles son los síntomas de la diabetes?",
    "idEmpleado": 2723
  }'
```

#### Establecer contexto y realizar consulta en una sola petición

```bash
curl -X POST "http://localhost:3000/api/v1/aymara/contexto" \
  -H "Content-Type: application/json" \
  -d '{
    "contextoMedico": {
      "paciente": {
        "nombre": "María García",
        "identificacion": "87654321",
        "edad": 35,
        "sexo": "femenino"
      },
      "idEmpleado": 2724
    },
    "pregunta": "¿Cuáles son los síntomas del asma?",
    "idEmpleado": 2724
  }'
```

#### Realizar consulta utilizando el contexto almacenado

```bash
curl -X GET "http://localhost:3000/api/v1/aymara/consulta?pregunta=¿Cuáles%20son%20los%20requisitos%20para%20radicar%20una%20factura%20a%20una%20EPS%20en%20Colombia?" \
  -b cookies.txt
```

#### Limpiar el contexto almacenado

```bash
curl -X POST "http://localhost:3000/api/v1/aymara/limpiar-contexto" \
  -b cookies.txt
```

### JavaScript (Node.js)

#### Usando Fetch API (GET)

```javascript
// Consulta a AYMARA usando Fetch API (GET)
async function consultarAymaraGet() {
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

consultarAymaraGet();
```

#### Establecer contexto médico para consultas posteriores

```javascript
// Establecer contexto médico para consultas posteriores
async function establecerContextoMedico() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    contextoMedico: {
      paciente: {
        nombre: 'Juan Pérez',
        identificacion: '12345678',
        edad: 45,
        sexo: 'masculino'
      },
      idEmpleado: 2723
    }
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return;
    }
    
    const responseData = await response.json();
    console.log('Resultado:', responseData.message);
    return responseData;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

establecerContextoMedico();
```

#### Realizar consulta con contexto previamente guardado

```javascript
// Realizar consulta con contexto previamente guardado
async function consultarConContextoGuardado() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    pregunta: '¿Cuáles son los síntomas de la diabetes?',
    idEmpleado: 2723
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return;
    }
    
    const responseData = await response.json();
    console.log('Respuesta:', responseData.respuesta);
    console.log('Tokens utilizados:', responseData.meta.tokens);
    return responseData;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

consultarConContextoGuardado();
```

#### Establecer contexto y realizar consulta en una sola petición

```javascript
// Establecer contexto y realizar consulta en una sola petición
async function establecerContextoYConsultar() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    contextoMedico: {
      paciente: {
        nombre: 'María García',
        identificacion: '87654321',
        edad: 35,
        sexo: 'femenino'
      },
      idEmpleado: 2724
    },
    pregunta: '¿Cuáles son los síntomas del asma?',
    idEmpleado: 2724
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return;
    }
    
    const responseData = await response.json();
    console.log('Mensaje:', responseData.message);
    console.log('Respuesta:', responseData.respuesta);
    console.log('Tokens utilizados:', responseData.meta.tokens);
    return responseData;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

establecerContextoYConsultar();
```

#### Consultar usando el contexto almacenado

```javascript
// Consultar usando el contexto almacenado
async function consultarConContextoAlmacenado() {
  const pregunta = encodeURIComponent('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
  const apiUrl = `http://localhost:3000/api/v1/aymara/consulta?pregunta=${pregunta}`;
  
  try {
    const response = await fetch(apiUrl, {
      credentials: 'include' // Importante para usar la sesión
    });
    
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

consultarConContextoAlmacenado();
```

#### Limpiar el contexto almacenado

```javascript
// Limpiar el contexto almacenado
async function limpiarContexto() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/limpiar-contexto';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include' // Importante para usar la sesión
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return;
    }
    
    const responseData = await response.json();
    console.log('Resultado:', responseData.message);
    return responseData;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

limpiarContexto();
```

#### Usando Axios (GET)

```javascript
// Consulta a AYMARA usando Axios (GET)
const axios = require('axios');

async function consultarAymaraAxiosGet() {
  const pregunta = encodeURIComponent('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
  const apiUrl = `http://localhost:3000/api/v1/aymara/consulta?pregunta=${pregunta}`;
  
  try {
    const response = await axios.get(apiUrl);
    console.log('Respuesta:', response.data.respuesta);
    console.log('Tokens utilizados:', response.data.meta.tokens);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

consultarAymaraAxiosGet();
```

#### Establecer contexto médico para consultas posteriores (Axios)

```javascript
// Establecer contexto médico para consultas posteriores usando Axios
const axios = require('axios');

async function establecerContextoMedicoAxios() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    contextoMedico: {
      paciente: {
        nombre: 'Juan Pérez',
        identificacion: '12345678',
        edad: 45,
        sexo: 'masculino'
      },
      idEmpleado: 2723
    }
  };
  
  try {
    const response = await axios.post(apiUrl, data);
    console.log('Resultado:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

establecerContextoMedicoAxios();
```

#### Realizar consulta con contexto previamente guardado (Axios)

```javascript
// Realizar consulta con contexto previamente guardado usando Axios
const axios = require('axios');

async function consultarConContextoGuardadoAxios() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    pregunta: '¿Cuáles son los síntomas de la diabetes?',
    idEmpleado: 2723
  };
  
  try {
    const response = await axios.post(apiUrl, data);
    console.log('Respuesta:', response.data.respuesta);
    console.log('Tokens utilizados:', response.data.meta.tokens);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

consultarConContextoGuardadoAxios();
```

#### Establecer contexto y realizar consulta en una sola petición (Axios)

```javascript
// Establecer contexto y realizar consulta en una sola petición usando Axios
const axios = require('axios');

async function establecerContextoYConsultarAxios() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
  const data = {
    contextoMedico: {
      paciente: {
        nombre: 'María García',
        identificacion: '87654321',
        edad: 35,
        sexo: 'femenino'
      },
      idEmpleado: 2724
    },
    pregunta: '¿Cuáles son los síntomas del asma?',
    idEmpleado: 2724
  };
  
  try {
    const response = await axios.post(apiUrl, data);
    console.log('Mensaje:', response.data.message);
    console.log('Respuesta:', response.data.respuesta);
    console.log('Tokens utilizados:', response.data.meta.tokens);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

establecerContextoYConsultarAxios();
```



#### Limpiar el contexto almacenado (Axios)

```javascript
// Limpiar el contexto almacenado con Axios
const axios = require('axios');

// Usar la misma instancia de Axios que mantiene las cookies
const axiosInstance = axios.create({
  withCredentials: true // Importante para usar la sesión
});

async function limpiarContextoAxios() {
  const apiUrl = 'http://localhost:3000/api/v1/aymara/limpiar-contexto';
  
  try {
    const response = await axiosInstance.post(apiUrl);
    console.log('Resultado:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

limpiarContextoAxios();
```

### Python

#### Usando Requests (GET)

```python
# Consulta a AYMARA usando Requests (GET)
import requests
import urllib.parse

def consultar_aymara_get():
    pregunta = urllib.parse.quote('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?')
    api_url = f'http://localhost:3000/api/v1/aymara/consulta?pregunta={pregunta}'
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        data = response.json()
        print('Respuesta:', data['respuesta'])
        print('Tokens utilizados:', data['meta']['tokens'])
        return data
    except requests.exceptions.RequestException as e:
        print('Error de conexión:', e)
    except ValueError as e:
        print('Error al procesar la respuesta JSON:', e)

consultar_aymara_get()
```

#### Establecer contexto médico para consultas posteriores

```python
# Establecer contexto médico para consultas posteriores
import requests

def establecer_contexto_medico():
    api_url = 'http://localhost:3000/api/v1/aymara/contexto'
    data = {
        'contextoMedico': {
            'paciente': {
                'nombre': 'Juan Pérez',
                'identificacion': '12345678',
                'edad': 45,
                'sexo': 'masculino'
            },
            'idEmpleado': 2723
        }
    }
    
    try:
        response = requests.post(api_url, json=data)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        data = response.json()
        print('Resultado:', data['message'])
        return data
    except requests.exceptions.RequestException as e:
        print('Error de conexión:', e)
    except ValueError as e:
        print('Error al procesar la respuesta JSON:', e)

establacer_contexto_medico()
```

#### Realizar consulta con contexto previamente guardado

```python
# Realizar consulta con contexto previamente guardado
import requests

def consultar_con_contexto_guardado():
    api_url = 'http://localhost:3000/api/v1/aymara/contexto'
    data = {
        'pregunta': '¿Cuáles son los síntomas de la diabetes?',
        'idEmpleado': 2723
    }
    
    try:
        response = requests.post(api_url, json=data)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        data = response.json()
        print('Respuesta:', data['respuesta'])
        print('Tokens utilizados:', data['meta']['tokens'])
        return data
    except requests.exceptions.RequestException as e:
        print('Error de conexión:', e)
    except ValueError as e:
        print('Error al procesar la respuesta JSON:', e)

consultar_con_contexto_guardado()
```

#### Establecer contexto y realizar consulta en una sola petición

```python
# Establecer contexto y realizar consulta en una sola petición
import requests

def establecer_contexto_y_consultar():
    api_url = 'http://localhost:3000/api/v1/aymara/contexto'
    data = {
        'contextoMedico': {
            'paciente': {
                'nombre': 'María García',
                'identificacion': '87654321',
                'edad': 35,
                'sexo': 'femenino'
            },
            'idEmpleado': 2724
        },
        'pregunta': '¿Cuáles son los síntomas del asma?',
        'idEmpleado': 2724
    }
    
    try:
        response = requests.post(api_url, json=data)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        data = response.json()
        print('Mensaje:', data['message'])
        print('Respuesta:', data['respuesta'])
        print('Tokens utilizados:', data['meta']['tokens'])
        return data
    except requests.exceptions.RequestException as e:
        print('Error de conexión:', e)
    except ValueError as e:
        print('Error al procesar la respuesta JSON:', e)

establacer_contexto_y_consultar()
```



#### Limpiar el contexto almacenado

```python
# Limpiar el contexto almacenado
import requests

# Usar la misma sesión que mantiene las cookies
sesion = requests.Session()

def limpiar_contexto():
    api_url = 'http://localhost:3000/api/v1/aymara/limpiar-contexto'
    
    try:
        response = sesion.post(api_url)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
        
        data = response.json()
        print('Resultado:', data['message'])
        return data
    except requests.exceptions.RequestException as e:
        print('Error de conexión:', e)
    except ValueError as e:
        print('Error al procesar la respuesta JSON:', e)

limpiar_contexto()
```

### PHP

#### Usando cURL (GET)

```php
<?php
// Consulta a AYMARA usando cURL (GET)
function consultarAymaraGet() {
    $pregunta = urlencode('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
    $apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta={$pregunta}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($httpCode !== 200) {
        echo "Error HTTP: {$httpCode}\n";
        return null;
    }
    
    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch) . "\n";
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    echo "Respuesta: {$data['respuesta']}\n";
    echo "Tokens utilizados: {$data['meta']['tokens']}\n";
    
    return $data;
}

consultarAymaraGet();
?>
```

#### Usando cURL (POST con contexto - OBSOLETO)

```php
<?php
// NOTA: El método POST para consultas con contexto ya no está disponible.
// Por favor, utiliza el método de establecer contexto y luego realizar consultas GET con cURL.
// Ejemplo:
// 1. Primero establece el contexto con establecerContexto()
// 2. Luego realiza consultas con consultarConContextoAlmacenado()
?>
```

#### Establecer contexto para consultas posteriores

```php
<?php
// Establecer contexto para consultas posteriores
function establecerContexto() {
    $apiUrl = 'http://localhost:3000/api/v1/aymara/contexto';
    $data = [
        'contexto' => 'Soy un médico especialista que trabaja en una IPS de tercer nivel'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($data))
    ]);
    curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookies.txt'); // Guardar cookies
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($httpCode !== 200) {
        echo "Error HTTP: {$httpCode}\n";
        return null;
    }
    
    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch) . "\n";
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    echo "Resultado: {$data['message']}\n";
    
    return $data;
}

establecerContexto();
?>
```

#### Consultar usando el contexto almacenado

```php
<?php
// Consultar usando el contexto almacenado
function consultarConContextoAlmacenado() {
    $pregunta = urlencode('¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?');
    $apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta={$pregunta}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt'); // Usar cookies guardadas
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($httpCode !== 200) {
        echo "Error HTTP: {$httpCode}\n";
        return null;
    }
    
    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch) . "\n";
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    echo "Respuesta: {$data['respuesta']}\n";
    echo "Tokens utilizados: {$data['meta']['tokens']}\n";
    
    return $data;
}

consultarConContextoAlmacenado();
?>
```

#### Limpiar el contexto almacenado

```php
<?php
// Limpiar el contexto almacenado
function limpiarContexto() {
    $apiUrl = 'http://localhost:3000/api/v1/aymara/limpiar-contexto';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt'); // Usar cookies guardadas
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($httpCode !== 200) {
        echo "Error HTTP: {$httpCode}\n";
        return null;
    }
    
    if (curl_errno($ch)) {
        echo 'Error de cURL: ' . curl_error($ch) . "\n";
        return null;
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    echo "Resultado: {$data['message']}\n";
    
    return $data;
}

limpiarContexto();
?>
```

### Java

#### Usando HttpClient (GET)

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class AymaraClientGet {
    public static void main(String[] args) {
        try {
            String pregunta = URLEncoder.encode("¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?", StandardCharsets.UTF_8);
            String apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta=" + pregunta;
            
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .GET()
                    .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                System.out.println("Error HTTP: " + response.statusCode());
                return;
            }
            
            JSONObject jsonResponse = new JSONObject(response.body());
            System.out.println("Respuesta: " + jsonResponse.getString("respuesta"));
            System.out.println("Tokens utilizados: " + jsonResponse.getJSONObject("meta").getInt("tokens"));
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

#### Usando HttpClient (POST con contexto - OBSOLETO)

```java
// NOTA: El método POST para consultas con contexto ya no está disponible.
// Por favor, utiliza el método de establecer contexto y luego realizar consultas GET con HttpClient.
// Ejemplo:
// 1. Primero establece el contexto con establecerContexto()
// 2. Luego realiza consultas con consultarConContextoAlmacenado()
```

#### Establecer contexto para consultas posteriores

```java
import java.net.URI;
import java.net.CookieManager;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class AymaraSetContext {
    public static void main(String[] args) {
        try {
            String apiUrl = "http://localhost:3000/api/v1/aymara/contexto";
            
            JSONObject requestBody = new JSONObject();
            requestBody.put("contexto", "Soy un médico especialista que trabaja en una IPS de tercer nivel");
            
            // Crear un cliente HTTP con soporte para cookies
            CookieManager cookieManager = new CookieManager();
            HttpClient client = HttpClient.newBuilder()
                    .cookieHandler(cookieManager)
                    .build();
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                System.out.println("Error HTTP: " + response.statusCode());
                return;
            }
            
            JSONObject jsonResponse = new JSONObject(response.body());
            System.out.println("Resultado: " + jsonResponse.getString("message"));
            
            // Guardar el cliente HTTP con las cookies para usarlo en consultas posteriores
            // En una aplicación real, deberías guardar este cliente o el cookieManager
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

#### Consultar usando el contexto almacenado

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.CookieManager;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class AymaraQueryWithStoredContext {
    public static void main(String[] args) {
        try {
            String pregunta = URLEncoder.encode("¿Cuáles son los requisitos para radicar una factura a una EPS en Colombia?", StandardCharsets.UTF_8);
            String apiUrl = "http://localhost:3000/api/v1/aymara/consulta?pregunta=" + pregunta;
            
            // Usar el mismo cliente HTTP con las cookies guardadas
            // En una aplicación real, deberías recuperar este cliente o el cookieManager
            CookieManager cookieManager = new CookieManager();
            HttpClient client = HttpClient.newBuilder()
                    .cookieHandler(cookieManager)
                    .build();
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .GET()
                    .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                System.out.println("Error HTTP: " + response.statusCode());
                return;
            }
            
            JSONObject jsonResponse = new JSONObject(response.body());
            System.out.println("Respuesta: " + jsonResponse.getString("respuesta"));
            System.out.println("Tokens utilizados: " + jsonResponse.getJSONObject("meta").getInt("tokens"));
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

#### Limpiar el contexto almacenado

```java
import java.net.URI;
import java.net.CookieManager;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class AymaraClearContext {
    public static void main(String[] args) {
        try {
            String apiUrl = "http://localhost:3000/api/v1/aymara/limpiar-contexto";
            
            // Usar el mismo cliente HTTP con las cookies guardadas
            // En una aplicación real, deberías recuperar este cliente o el cookieManager
            CookieManager cookieManager = new CookieManager();
            HttpClient client = HttpClient.newBuilder()
                    .cookieHandler(cookieManager)
                    .build();
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                System.out.println("Error HTTP: " + response.statusCode());
                return;
            }
            
            JSONObject jsonResponse = new JSONObject(response.body());
            System.out.println("Resultado: " + jsonResponse.getString("message"));
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```