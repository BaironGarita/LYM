@echo off
echo Probando sistema de reseñas con autenticacion...
echo.

echo 1. Intentando crear reseña SIN usuario válido (debe fallar):
curl -X POST "http://localhost:8000/?url=resenas" ^
  -H "Content-Type: application/json" ^
  -d "{\"usuario_id\":999,\"producto_id\":1,\"valoracion\":5,\"comentario\":\"Esta reseña no debería crearse\"}"
echo.
echo.

echo 2. Primero registrando usuario de prueba:
curl -X POST "http://localhost:8000/?url=usuarios" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Usuario Prueba\",\"correo\":\"prueba@test.com\",\"contrasena\":\"123456\"}"
echo.
echo.

echo 3. Obteniendo ID del usuario creado:
curl -X GET "http://localhost:8000/?url=usuarios" | findstr "prueba@test.com"
echo.
echo.

echo 4. Ahora creando reseña con usuario válido (ID 1 si es el primero):
curl -X POST "http://localhost:8000/?url=resenas" ^
  -H "Content-Type: application/json" ^
  -d "{\"usuario_id\":1,\"producto_id\":1,\"valoracion\":5,\"comentario\":\"Esta reseña SI debería crearse\"}"
echo.

pause
