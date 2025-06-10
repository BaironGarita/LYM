@echo off
title Sincronizando API LYM con XAMPP
color 0A

echo ================================================
echo        🔄 SINCRONIZANDO API_LYM CON XAMPP
echo ================================================
echo.

REM Verificar si existe la carpeta de XAMPP
if not exist "C:\xampp\htdocs" (
    echo ❌ ERROR: XAMPP no encontrado en C:\xampp\htdocs
    echo    Por favor, instala XAMPP o ajusta la ruta.
    pause
    exit /b 1
)

REM Crear directorio api_lym si no existe
if not exist "C:\xampp\htdocs\api_lym" (
    echo 📁 Creando directorio api_lym en XAMPP...
    mkdir "C:\xampp\htdocs\api_lym"
)

REM Sincronizar archivos
echo 📋 Copiando archivos de API...
xcopy ".\api\*" "C:\xampp\htdocs\api_lym\" /E /Y /I /Q

echo.
echo ✅ API sincronizada exitosamente!
echo.
echo 🌐 URLs disponibles:
echo    - API XAMPP: http://localhost/api_lym/
echo    - phpMyAdmin: http://localhost/phpmyadmin/
echo.
echo 💡 Recuerda iniciar Apache y MySQL desde XAMPP
pause