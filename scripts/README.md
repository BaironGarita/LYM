# 🛠️ Scripts de Automatización LYM

Esta carpeta contiene scripts para automatizar tareas comunes del proyecto LYM.

## 📋 Scripts Disponibles

### 🔄 **Sincronización de API**

#### Windows

```batch
.\scripts\sync-api.bat
```

#### Linux/Mac

```bash
./scripts/sync-api.sh
```

**Función:** Sincroniza la carpeta `./api/` con `C:\xampp\htdocs\api_lym\`

### 🚀 **Configuración Inicial**

#### Windows

```batch
.\scripts\setup.bat
```

#### Linux/Mac

```bash
./scripts/setup.sh
```

**Función:**

- Crea la estructura de carpetas del proyecto
- Verifica la instalación de XAMPP
- Prepara el entorno de desarrollo

## 🎯 **Flujo de Trabajo**

### 1. **Primera vez:**

```bash
# Ejecutar configuración inicial
./scripts/setup.sh    # Linux/Mac
.\scripts\setup.bat   # Windows
```

### 2. **Desarrollo diario:**

```bash
# Después de hacer cambios en ./api/
./scripts/sync-api.sh    # Linux/Mac
.\scripts\sync-api.bat   # Windows
```

### 3. **Verificación:**

- Abrir: http://localhost/api_lym/
- Verificar que los cambios se reflejen

## ⚙️ **Configuración de Rutas**

Si tu XAMPP está en una ubicación diferente, edita estas variables:

### Windows (sync-api.bat)

```batch
REM Cambiar esta línea si XAMPP está en otra ubicación
set XAMPP_PATH=C:\xampp\htdocs
```

### Linux/Mac (sync-api.sh)

```bash
# Cambiar estas rutas según tu instalación
XAMPP_PATH="/opt/lampp/htdocs"        # Linux
XAMPP_PATH="/Applications/XAMPP/htdocs"  # Mac
XAMPP_PATH="/c/xampp/htdocs"          # Windows con Git Bash
```

## 🔧 **Permisos (Linux/Mac)**

Hacer scripts ejecutables:

```bash
chmod +x scripts/*.sh
```

## 🆘 **Solución de Problemas**

### Error: "XAMPP no encontrado"

1. Verificar instalación de XAMPP
2. Ajustar rutas en los scripts
3. Ejecutar como administrador si es necesario

### Error: "Permisos denegados"

```bash
# Linux/Mac
sudo chmod +x scripts/*.sh

# Windows
# Ejecutar PowerShell como Administrador
```

### API no se actualiza en XAMPP

1. Verificar que Apache esté corriendo
2. Limpiar caché del navegador
3. Revisar logs de Apache en XAMPP
