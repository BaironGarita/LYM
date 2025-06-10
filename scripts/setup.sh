#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}           🚀 CONFIGURACIÓN INICIAL LYM${NC}"
echo -e "${BLUE}================================================${NC}"
echo

echo -e "${YELLOW}📋 Verificando estructura del proyecto...${NC}"

# Crear carpetas si no existen
[ ! -d "api" ] && echo -e "${YELLOW}📁 Creando carpeta api...${NC}" && mkdir -p api
[ ! -d "frontend" ] && echo -e "${YELLOW}📁 Creando carpeta frontend...${NC}" && mkdir -p frontend
[ ! -d "docs" ] && echo -e "${YELLOW}📁 Creando carpeta docs...${NC}" && mkdir -p docs

echo
echo -e "${YELLOW}🔧 Verificando XAMPP...${NC}"

# Detectar XAMPP según el OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    XAMPP_PATH="/Applications/XAMPP"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    XAMPP_PATH="/c/xampp"
else
    XAMPP_PATH="/opt/lampp"
fi

if [ -d "$XAMPP_PATH" ]; then
    echo -e "${GREEN}✅ XAMPP encontrado en $XAMPP_PATH${NC}"
else
    echo -e "${YELLOW}⚠️  XAMPP no encontrado${NC}"
    echo -e "   Por favor, instala XAMPP desde: https://www.apachefriends.org/"
fi

echo
echo -e "${BLUE}📊 Estado del proyecto:${NC}"
echo -e "   ✅ Estructura de carpetas creada"
echo -e "   📁 ./api/      - Para tu API PHP"
echo -e "   📁 ./frontend/ - Para React (futuro)"
echo -e "   📁 ./docs/     - Para documentación"
echo -e "   📁 ./scripts/  - Scripts de automatización"
echo
echo -e "${BLUE}🎯 Próximos pasos:${NC}"
echo -e "   1. Copia tu api_lym a la carpeta ./api/"
echo -e "   2. Ejecuta ./scripts/sync-api.sh para sincronizar"
echo -e "   3. Crea tu frontend React en ./frontend/"
echo

# Hacer el script ejecutable
chmod +x scripts/*.sh
echo -e "${GREEN}✅ Scripts configurados como ejecutables${NC}"