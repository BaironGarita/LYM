@echo off
title Configuración Inicial LYM
color 0B

echo ================================================
echo           🚀 CONFIGURACIÓN INICIAL LYM
echo ================================================
echo.

echo 📋 Verificando estructura del proyecto...

REM Crear carpetas si no existen
if not exist "api" (
    echo 📁 Creando carpeta api...
    mkdir api
)

if not exist "frontend" (
    echo 📁 Creando carpeta frontend...
    mkdir frontend
)

if not exist "docs" (
    echo 📁 Creando carpeta docs...
    mkdir docs
)

echo.
echo 🔧 Verificando XAMPP...

if exist "C:\xampp\xampp-control.exe" (
    echo ✅ XAMPP encontrado
    
    echo 🚀 ¿Quieres iniciar XAMPP ahora? (s/n)
    choice /c SN /m "Presiona S para Sí o N para No"
    if errorlevel 2 goto :skip_xampp
    if errorlevel 1 (
        echo 🔄 Iniciando XAMPP...
        start "" "C:\xampp\xampp-control.exe"
    )
) else (
    echo ⚠️  XAMPP no encontrado en la ubicación estándar
    echo    Por favor, instala XAMPP desde: https://www.apachefriends.org/
)

:skip_xampp
echo.
echo 📊 Estado del proyecto:
echo    ✅ Estructura de carpetas creada
echo    📁 ./api/      - Para tu API PHP
echo    📁 ./frontend/ - Para React (futuro)
echo    📁 ./docs/     - Para documentación
echo    📁 ./scripts/  - Scripts de automatización
echo.
echo 🎯 Próximos pasos:
echo    1. Copia tu api_lym a la carpeta ./api/
echo    2. Ejecuta sync-api.bat para sincronizar
echo    3. Crea tu frontend React en ./frontend/
echo.
pause