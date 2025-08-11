#!/bin/bash

# Script para desplegar la API AYMARA en Render

echo "🚀 Iniciando despliegue a Render..."

# Verificar que render-cli esté instalado
if ! command -v render &> /dev/null; then
    echo "❌ render-cli no está instalado. Instalando..."
    npm install -g @render/cli
fi

# Verificar que el archivo render.yaml existe
if [ ! -f "render.yaml" ]; then
    echo "❌ No se encontró el archivo render.yaml en el directorio actual"
    exit 1
fi

# Verificar que se ha iniciado sesión en render-cli
render whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ No has iniciado sesión en render-cli. Iniciando proceso de login..."
    render login
fi

# Desplegar usando el blueprint
echo "🔄 Desplegando a Render usando blueprint..."
render blueprint apply

if [ $? -eq 0 ]; then
    echo "✅ Despliegue iniciado correctamente"
    echo "📊 Puedes verificar el estado del despliegue en el dashboard de Render"
    echo "🌐 Una vez completado, tu API estará disponible en: https://aymara-api.onrender.com"
else
    echo "❌ Error al iniciar el despliegue"
    exit 1
fi