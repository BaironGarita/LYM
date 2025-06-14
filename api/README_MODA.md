# 🛍️ LYM API - Look Your Mood

_API REST para E-commerce de Moda y Accesorios_

![API Status](https://img.shields.io/badge/API-Active-brightgreen?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)

## 🎯 Descripción

Esta API REST está diseñada para soportar el sistema de e-commerce **LYM (Look Your Mood)**, especializado en **moda y accesorios personalizables**. Permite la gestión completa de productos, categorías, etiquetas, usuarios, pedidos y más.

### ✨ Características Principales

- 🛍️ **Gestión de Productos**: CRUD completo con soporte para personalización
- 🏪 **Categorías**: Organización jerárquica de productos
- 🏷️ **Etiquetas**: Sistema de tags para filtrado avanzado
- 👥 **Usuarios**: Gestión de clientes y administradores
- 🛒 **Carrito**: Persistencia de productos seleccionados
- 📦 **Pedidos**: Seguimiento completo del proceso de compra
- ⭐ **Reseñas**: Sistema de valoraciones y comentarios
- 💰 **Promociones**: Descuentos automáticos por categoría/producto

---

## 🏗️ Estructura del Proyecto

```
api/
├── controllers/
│   ├── ProductoController.php      # Gestión de productos de moda
│   ├── CategoriaController.php     # Categorías (Bolsos, Accesorios, etc.)
│   ├── EtiquetaController.php      # Etiquetas (Premium, Artesanal, etc.)
│   └── core/
│       ├── Config.php              # Configuración general
│       ├── MySqlConnect.php        # Conexión a base de datos
│       ├── Request.php             # Manejo de peticiones HTTP
│       └── Response.php            # Respuestas estandarizadas
├── models/
│   ├── ProductoModel.php           # Modelo de productos
│   ├── CategoriaModel.php          # Modelo de categorías
│   └── EtiquetaModel.php           # Modelo de etiquetas
├── routes/
│   └── RoutesController.php        # Enrutador principal
├── database/
│   ├── lym_moda_database.sql       # Schema de base de datos
│   └── LYM_Moda_2025.postman_collection.json
├── uploads/                        # Imágenes de productos
└── vendor/                         # Dependencias Composer
```

---

## 🚀 Instalación y Configuración

### 1. **Requisitos Previos**

```bash
PHP >= 8.2
MySQL >= 5.7
Composer
```

### 2. **Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/lym-api.git
cd lym-api

# Instalar dependencias
composer install

# Configurar base de datos
cp config.example.php config.php
# Editar config.php con tus credenciales

# Importar base de datos
mysql -u root -p < database/lym_moda_database.sql
```

### 3. **Configuración**

```php
// config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'lym_db');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
define('API_URL', 'http://localhost:81/api');
```

---

## 📚 Endpoints de la API

### 🏷️ **Etiquetas**

| Método   | Endpoint                       | Descripción                |
| -------- | ------------------------------ | -------------------------- |
| `GET`    | `/api/etiquetas`               | Listar todas las etiquetas |
| `GET`    | `/api/etiquetas/get?id=:id`    | Obtener etiqueta por ID    |
| `POST`   | `/api/etiquetas/create`        | Crear nueva etiqueta       |
| `PUT`    | `/api/etiquetas/update`        | Actualizar etiqueta        |
| `DELETE` | `/api/etiquetas/delete?id=:id` | Eliminar etiqueta          |

### 🏪 **Categorías**

| Método   | Endpoint                                     | Descripción                 |
| -------- | -------------------------------------------- | --------------------------- |
| `GET`    | `/api/categorias`                            | Listar todas las categorías |
| `GET`    | `/api/categorias/get?id=:id`                 | Obtener categoría por ID    |
| `POST`   | `/api/categorias/create`                     | Crear nueva categoría       |
| `PUT`    | `/api/categorias/update`                     | Actualizar categoría        |
| `DELETE` | `/api/categorias/delete?id=:id`              | Eliminar categoría          |
| `GET`    | `/api/categorias/productos?categoria_id=:id` | Productos de una categoría  |

### 🛍️ **Productos**

| Método   | Endpoint                                    | Descripción                |
| -------- | ------------------------------------------- | -------------------------- |
| `GET`    | `/api/productos`                            | Listar todos los productos |
| `GET`    | `/api/productos/get?id=:id`                 | Obtener producto por ID    |
| `POST`   | `/api/productos/create`                     | Crear nuevo producto       |
| `PUT`    | `/api/productos/update`                     | Actualizar producto        |
| `DELETE` | `/api/productos/delete?id=:id`              | Eliminar producto          |
| `GET`    | `/api/productos/categoria?categoria_id=:id` | Productos por categoría    |
| `GET`    | `/api/productos/buscar?q=:query`            | Buscar productos           |

---

## 🧪 Ejemplos de Uso

### **Crear Etiqueta**

```bash
POST /api/etiquetas/create
Content-Type: application/json

{
    "nombre": "Premium",
    "activo": 1
}
```

### **Crear Producto - Bolso Milano**

```bash
POST /api/productos/create
Content-Type: application/json

{
    "nombre": "Bolso Milano Premium",
    "descripcion": "Bolso de cuero artesanal italiano",
    "precio": 299.99,
    "categoria_id": 1,
    "stock": 50,
    "material": "Cuero genuino italiano",
    "color_principal": "Negro Premium",
    "genero": "unisex",
    "etiquetas": [1, 2, 3, 4, 6]
}
```

### **Buscar Productos**

```bash
GET /api/productos/buscar?q=bolso&categoria=1&precio_min=100&precio_max=500
```

---

## 📊 Respuestas de la API

### **Respuesta Exitosa**

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Bolso Milano Premium",
      "descripcion": "Bolso de cuero artesanal italiano",
      "precio": "299.99",
      "categoria_nombre": "Bolsos",
      "total_resenas": 5,
      "promedio_valoracion": "4.8"
    }
  ]
}
```

### **Respuesta de Error**

```json
{
  "error": "El nombre es obligatorio",
  "status": 400
}
```

---

## 🔧 Configuración de Postman

### **Variables de Entorno**

```json
{
  "base_url": "http://localhost:81",
  "api_prefix": "api"
}
```

### **Importar Colección**

1. Importar `database/LYM_Moda_2025.postman_collection.json`
2. Configurar variables de entorno
3. Ejecutar requests de prueba

---

## 🛡️ Seguridad

### **Validación de Datos**

- Escape de caracteres SQL
- Validación de tipos de datos
- Sanitización de entrada

### **Manejo de Errores**

- Logging automático de errores
- Respuestas estandarizadas
- Manejo de excepciones

---

## 🔄 Compatibilidad Legacy

La API mantiene **compatibilidad con rutas legacy** para transición:

```bash
# Rutas legacy (DEPRECATED)
GET /apimovie/etiqueta          → GET /api/etiquetas
POST /apimovie/etiqueta/create  → POST /api/etiquetas/create
```

⚠️ **Nota**: Las rutas legacy serán removidas en la versión 2.0

---

## 📈 Próximas Mejoras

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Caché de respuestas
- [ ] Documentación OpenAPI
- [ ] Tests automatizados
- [ ] CI/CD pipeline

---

## 👥 Equipo de Desarrollo

| Desarrollador                        | Email                     | Rol                  |
| ------------------------------------ | ------------------------- | -------------------- |
| **Nayeli Arrieta Castro**            | nayeliarrieta02@gmail.com | Full Stack Developer |
| **Bairon Eduardo Garita Ballestero** | Bairongarita291@gmail.com | Backend Developer    |

---

## 📄 Licencia

Este proyecto es parte del curso **ISW-613 Programación en Ambiente Web I** de la Universidad Técnica Nacional de Costa Rica.

**Profesor**: Roosvelt Reyes Pérez

---

<div align="center">

**🛍️ LYM API - Encuentra tu estilo, refleja tu estado de ánimo**

_Desarrollado con ❤️ para el curso ISW-613_

</div>
