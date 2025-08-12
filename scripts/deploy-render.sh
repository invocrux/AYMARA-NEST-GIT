#!/bin/bash

# Script para desplegar la API AYMARA en Render

echo "🚀 Iniciando despliegue a Render..."

# Verificar que render-cli esté instalado
if ! command -v render &> /dev/null; then
    echo "❌ render-cli no está instalado. Instalando..."
    echo "Instalando render-cli usando Homebrew..."
    brew update && brew install render
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

echo "ℹ️ NOTA IMPORTANTE: La nueva versión del CLI de Render no soporta el comando 'blueprint apply'."
echo "ℹ️ Para desplegar tu aplicación, tienes dos opciones:"
echo ""
echo "1️⃣ Despliegue manual a través del Dashboard de Render:"
echo "   - Inicia sesión en https://dashboard.render.com"
echo "   - Haz clic en 'New +' y selecciona 'Blueprint'"
echo "   - Conecta tu repositorio y selecciona la rama que contiene el archivo render.yaml"
echo "   - Revisa la configuración y haz clic en 'Apply'"
echo ""
echo "2️⃣ Despliegue usando el Dashboard de Render para servicios individuales:"
echo "   - Inicia sesión en https://dashboard.render.com"
echo "   - Haz clic en 'New +' y selecciona 'Web Service'"
echo "   - Sigue las instrucciones en docs/despliegue-render.md"
echo ""
echo "✅ El archivo render.yaml está listo para ser utilizado en cualquiera de estas opciones"
echo "📊 Una vez completado el despliegue, tu API estará disponible en la URL proporcionada por Render"
echo "🔍 Para más detalles, consulta la documentación en docs/despliegue-render.md"

exit 0