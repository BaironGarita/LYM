# 🚀 LYM API - Look Your Mood Backend

![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completo-brightgreen?style=flat-square)

## 📋 Tabla de Contenidos

- [🌟 Descripción](#-descripción)
- [🏗️ Arquitectura](#️-arquitectura)
- [🔧 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [📚 Endpoints de la API](#-endpoints-de-la-api)
- [🔐 Autenticación](#-autenticación)
- [📊 Estructura de Respuestas](#-estructura-de-respuestas)
- [🧪 Ejemplos de Uso](#-ejemplos-de-uso)
- [🚨 Códigos de Error](#-códigos-de-error)
- [🛠️ Desarrollo](#️-desarrollo)

## 🌟 Descripción

La **LYM API** es el backend del proyecto Look Your Mood, una plataforma de e-commerce especializada en moda y accesorios personalizables. Desarrollada en **PHP 8.2+** con **MySQL**, proporciona una interfaz RESTful completa para la gestión de productos, usuarios, pedidos y más.

### ✨ Características Principales

- 🔐 **Autenticación JWT** (temporalmente deshabilitada para desarrollo)
- 📦 **CRUD completo** para todas las entidades
- 🛡️ **Middleware de seguridad** y validación
- 📊 **Logging avanzado** de operaciones
- 🌐 **CORS configurado** para desarrollo frontend
- 🔄 **Manejo de excepciones** robusto

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   Backend API   │◄──►│    Database     │
│   (React)       │    │   (PHP 8.2+)    │    │   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         └────────────────────────┼────────────────────────
                                  │
                            ┌─────▼─────┐
                            │  APIs      │
                            │ Externas   │
                            └───────────┘
```

### 🏛️ Estructura de Carpetas

```
api/
├── 📁 controllers/
│   ├── 📁 core/
│   │   ├── Config.php
│   │   ├── HandleException.php
│   │   ├── Logger.php
│   │   ├── MySqlConnect.php
│   │   ├── Request.php
│   │   └── Response.php
│   └── EtiquetaController.php
├── 📁 models/
│   └── EtiquetaModel.php
├── 📁 routes/
│   └── RoutesController.php
├── 📁 Log/
├── 📁 vendor/
├── config.php
├── index.php
└── composer.json
```

## 🔧 Instalación

### Prerrequisitos

- **PHP 8.2** o superior
- **MySQL 5.7** o superior
- **Composer**
- **XAMPP** (recomendado para desarrollo)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/BaironGarita/LYM.git
cd LYM
```

2. **Instalar dependencias**

```bash
cd api
composer install
```

3. **Configurar XAMPP**

```bash
# Windows
.\scripts\sync-api.bat

# Linux/Mac
./scripts/sync-api.sh
```

4. **Configurar base de datos**

- Crear base de datos `lym_db` en MySQL
- Importar el schema necesario
- Ajustar credenciales en `config.php`

5. **Iniciar servidor**

- Iniciar Apache y MySQL en XAMPP
- Acceder a: `http://localhost/api_lym/`

## ⚙️ Configuración

### 📄 config.php

```php
<?php
return [
    'LOG_PATH' => __DIR__ . '/Log',
    'DB_USERNAME' => 'root',
    'DB_PASSWORD' => '123456',
    'DB_HOST' => 'localhost',
    'DB_DBNAME' => 'lym_db',
    'SECRET_KEY' => 'tu_clave_secreta_jwt'
];
```

### 🌐 CORS

La API está configurada para aceptar requests desde cualquier origen durante el desarrollo:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');
```

## 📚 Endpoints de la API

### 🏷️ Etiquetas

| Método   | Endpoint                         | Descripción                 | Autenticación                  |
| -------- | -------------------------------- | --------------------------- | ------------------------------ |
| `GET`    | `/apimovie/etiqueta`             | Obtener todas las etiquetas | ⚠️ Temporalmente deshabilitada |
| `GET`    | `/apimovie/etiqueta/get?id={id}` | Obtener etiqueta por ID     | ⚠️ Temporalmente deshabilitada |
| `POST`   | `/apimovie/etiqueta/create`      | Crear nueva etiqueta        | ⚠️ Temporalmente deshabilitada |
| `PUT`    | `/apimovie/etiqueta/update`      | Actualizar etiqueta         | ⚠️ Temporalmente deshabilitada |
| `DELETE` | `/apimovie/etiqueta/delete`      | Eliminar etiqueta           | ⚠️ Temporalmente deshabilitada |

### 🎬 Actores (Ejemplo)

| Método | Endpoint          | Descripción               | Autenticación                  |
| ------ | ----------------- | ------------------------- | ------------------------------ |
| `GET`  | `/apimovie/actor` | Obtener todos los actores | ⚠️ Temporalmente deshabilitada |

> **Nota**: La autenticación está temporalmente deshabilitada para facilitar el desarrollo. En producción se requiere rol de Administrador.

## 🔐 Autenticación

### 🚧 Estado Actual

La autenticación JWT está **temporalmente deshabilitada** en el código para facilitar el desarrollo:

```php
// Comentar temporalmente la autenticación
// $this->authMiddleware = new AuthMiddleware();
```

### 🔒 Implementación Futura

Cuando se habilite, la API utilizará:

- **JWT (JSON Web Tokens)** para autenticación
- **Roles de usuario**: Administrador, Cliente
- **Middleware de autorización** para rutas protegidas

## 📊 Estructura de Respuestas

### ✅ Respuesta Exitosa

```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nombre": "Casual",
      "descripcion": "Ropa casual y cómoda",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### ❌ Respuesta de Error

```json
{
  "status": 404,
  "error": "Etiqueta no encontrada",
  "message": "No se encontró la etiqueta con el ID especificado"
}
```

## 🧪 Ejemplos de Uso

### 📋 Obtener Todas las Etiquetas

```bash
curl -X GET http://localhost/api_lym/apimovie/etiqueta \
  -H "Content-Type: application/json"
```

### 🔍 Obtener Etiqueta por ID

```bash
curl -X GET "http://localhost/api_lym/apimovie/etiqueta/get?id=1" \
  -H "Content-Type: application/json"
```

### ➕ Crear Nueva Etiqueta

```bash
curl -X POST http://localhost/api_lym/apimovie/etiqueta/create \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Elegante",
    "descripcion": "Ropa elegante para ocasiones especiales"
  }'
```

### 🔄 Actualizar Etiqueta

```bash
curl -X PUT http://localhost/api_lym/apimovie/etiqueta/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nombre": "Casual Actualizado",
    "descripcion": "Nueva descripción"
  }'
```

### 🗑️ Eliminar Etiqueta

```bash
curl -X DELETE http://localhost/api_lym/apimovie/etiqueta/delete \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

## 🚨 Códigos de Error

| Código | Significado              | Descripción                 |
| ------ | ------------------------ | --------------------------- |
| `200`  | ✅ OK                    | Solicitud exitosa           |
| `201`  | ✅ Created               | Recurso creado exitosamente |
| `400`  | ❌ Bad Request           | Datos de entrada inválidos  |
| `401`  | 🔒 Unauthorized          | Autenticación requerida     |
| `403`  | 🚫 Forbidden             | Permisos insuficientes      |
| `404`  | 🔍 Not Found             | Recurso no encontrado       |
| `500`  | 🔥 Internal Server Error | Error interno del servidor  |

## 🛠️ Desarrollo

### 🔧 Herramientas de Desarrollo

#### Scripts de Automatización

```bash
# Sincronizar API con XAMPP
./scripts/sync-api.sh    # Linux/Mac
.\scripts\sync-api.bat   # Windows

# Configuración inicial
./scripts/setup.sh       # Linux/Mac
.\scripts\setup.bat      # Windows
```

### 📊 Logging

La API incluye un sistema de logging robusto:

```php
// Los logs se guardan en /api/Log/
Logger::info('Operación exitosa');
Logger::error('Error en la operación', $exception);
```

### 🔄 Manejo de Excepciones

```php
try {
    // Operación
} catch (Exception $e) {
    handleException($e);
}
```

### 🧪 Testing

```bash
# Verificar funcionamiento
curl http://localhost/api_lym/

# Verificar endpoint específico
curl http://localhost/api_lym/apimovie/etiqueta
```

## 📞 Soporte

### 👥 Equipo de Desarrollo

| Desarrollador                        | Email                     | Teléfono |
| ------------------------------------ | ------------------------- | -------- |
| **Nayeli Arrieta Castro**            | nayeliarrieta02@gmail.com | 85535095 |
| **Bairon Eduardo Garita Ballestero** | Bairongarita291@gmail.com | 87889979 |

### 🎓 Información Académica

- **Curso**: ISW-613 Programación en Ambiente Web I
- **Profesor**: Roosvelt Reyes Pérez
- **Universidad**: Universidad Técnica Nacional de Costa Rica

## 📄 Licencia

Este proyecto está desarrollado con fines académicos para el curso ISW-613.

---

<div align="center">

**🚀 LYM API - Potenciando tu experiencia de moda**

![Progress](https://img.shields.io/badge/Estado-Completo-brightgreen?style=for-the-badge)

_Desarrollado con ❤️ por el equipo LYM_

</div>
