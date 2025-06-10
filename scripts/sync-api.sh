#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}        🔄 SINCRONIZANDO API_LYM CON XAMPP${NC}"
echo -e "${BLUE}================================================${NC}"
echo

# Detectar sistema operativo
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    XAMPP_PATH="/c/xampp/htdocs"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    XAMPP_PATH="/Applications/XAMPP/htdocs"
else
    XAMPP_PATH="/opt/lampp/htdocs"
fi

# Verificar si existe XAMPP
if [ ! -d "$XAMPP_PATH" ]; then
    echo -e "${RED}❌ ERROR: XAMPP no encontrado en $XAMPP_PATH${NC}"
    echo -e "${YELLOW}   Por favor, ajusta la ruta en el script.${NC}"
    exit 1
fi

# Crear directorio si no existe
if [ ! -d "$XAMPP_PATH/api_lym" ]; then
    echo -e "${YELLOW}📁 Creando directorio api_lym...${NC}"
    mkdir -p "$XAMPP_PATH/api_lym"
fi

# Sincronizar archivos
echo -e "${YELLOW}📋 Copiando archivos de API...${NC}"
cp -r ./api/* "$XAMPP_PATH/api_lym/"

echo
echo -e "${GREEN}✅ API sincronizada exitosamente!${NC}"
echo
echo -e "${BLUE}🌐 URLs disponibles:${NC}"
echo -e "   - API XAMPP: http://localhost/api_lym/"
echo -e "   - phpMyAdmin: http://localhost/phpmyadmin/"
echo
echo -e "${YELLOW}💡 Recuerda iniciar Apache y MySQL desde XAMPP${NC}"