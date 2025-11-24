#!/bin/bash

# 🚀 SCRIPT PARA COMPARTILHAR AIR X COM NGROK

echo "=========================================="
echo "🚁 AIR X - Compartilhador de Link"
echo "=========================================="
echo ""

# Verificar se ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok não está instalado"
    echo "Instalando ngrok..."
    brew install ngrok/ngrok/ngrok
fi

echo ""
echo "📋 Para usar ngrok, você precisa:"
echo ""
echo "1. Criar conta GRATUITA em: https://ngrok.com/signup"
echo ""
echo "2. Ir para: https://dashboard.ngrok.com/get-started/your-authtoken"
echo ""
echo "3. Copiar seu token"
echo ""
echo "4. Executar:"
echo "   ngrok config add-authtoken SEU_TOKEN_AQUI"
echo ""
echo "5. Depois executar:"
echo "   ngrok http 3000"
echo ""
echo "=========================================="
echo ""
echo "⚠️  OU use a opção MAIS FÁCIL:"
echo ""
echo "Link local na sua rede:"
echo "   http://192.168.0.240:3000"
echo ""
echo "Seu amigo precisa estar na mesma WiFi!"
echo "=========================================="
