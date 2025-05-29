# 🛍️ LYM - Look Your Mood
*Encuentra tu estilo, refleja tu estado de ánimo*

![LYM Logo](https://img.shields.io/badge/LYM-Look%20Your%20Mood-purple?style=for-the-badge&logo=shopping-bag)

## 🌟 ¿Qué es LYM?

**LYM (Look Your Mood)** es una plataforma de e-commerce revolucionaria enfocada en **Moda y Accesorios de Vestir** que te permite expresar tu personalidad única a través de productos personalizables de alta calidad.

### ✨ Nuestra Filosofía
Creemos que la moda es más que ropa: es una forma de comunicar quién eres. Con LYM, cada compra es una declaración personal que refleja tu estado de ánimo y estilo único.

---

## 🎯 Características Principales

### 🛍️ **Experiencia de Compra Personalizada**
- **Productos Customizables**: Nuestro producto estrella, el **Bolso de Cuero Artesanal "Milano"**, ofrece múltiples opciones de personalización
- **Filtros Inteligentes**: Búsqueda por categoría, etiquetas y valoraciones
- **Carrito Persistente**: Guarda tus productos favoritos incluso después de cerrar sesión

### 🎨 **Personalización del Bolso Milano**
| Criterio | Opciones Disponibles |
|----------|---------------------|
| **🎨 Color** | Negro Premium, Cognac Italiano, Beige Nude |
| **📏 Tamaño** | Pequeño (25cm), Mediano (30cm), Grande (35cm) |
| **🔒 Tipo de Cierre** | Cremallera dorada, Broche magnético, Cordón ajustable |
| **🏷️ Material Base** | Cuero genuino italiano (Premium) |

### 🏪 **Panel de Administración Completo**
- 📊 Dashboard con estadísticas en tiempo real
- 📈 Análisis de ventas por día y mes
- 🏆 Top 3 productos más vendidos
- ⭐ Gestión de reseñas y valoraciones

### 🌍 **Experiencia Multiidioma**
- 🇪🇸 Español
- 🇺🇸 Inglés
- 🔄 Cambio dinámico de idioma
- 💾 Persistencia de preferencias

---

## 🚀 Tecnologías Utilizadas

### **Backend**
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)

### **Frontend**
![React](https://img.shields.io/badge/React-18.2.0+-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### **Integraciones API**
- 🌍 API de países para información geográfica
- 💳 Validación de tarjetas de crédito
- 💱 Conversión de tipos de cambio en tiempo real

---

## 👥 Equipo de Desarrollo

| Desarrollador | Identificación | Email | Teléfono |
|---------------|----------------|-------|----------|
| **Nayeli Arrieta Castro** | 208610516 | nayeliarrieta02@gmail.com | 85535095 |
| **Bairon Eduardo Garita Ballestero** | 208650868 | Bairongarita291@gmail.com | 87889979 |

---

## 🏗️ Arquitectura del Sistema

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

---

## 📋 Funcionalidades Implementadas

### 🔐 **Autenticación y Autorización**
- [x] Registro de usuarios
- [x] Inicio de sesión seguro
- [x] Gestión de roles (Administrador/Cliente)
- [x] Restablecimiento de contraseñas

### 📦 **Gestión de Productos**
- [x] CRUD completo de productos
- [x] Múltiples imágenes por producto
- [x] Sistema de categorías
- [x] Gestión de inventario
- [x] Recuperación de productos eliminados

### 🏷️ **Sistema de Etiquetas**
- [x] Asignación múltiple de etiquetas
- [x] Filtrado por etiquetas
- [x] Gestión dinámica de etiquetas

### ⭐ **Reseñas y Valoraciones**
- [x] Sistema de valoración de 1-5 estrellas
- [x] Comentarios de usuarios
- [x] Moderación de reseñas
- [x] Estadísticas de valoraciones

### 🎁 **Promociones Automáticas**
- [x] Descuentos por categoría
- [x] Descuentos por producto específico
- [x] Fechas de vigencia automáticas
- [x] Aplicación dinámica de promociones

### 📦 **Gestión de Pedidos**
- [x] Estados de pedido: En Proceso → Pagado → Entregado
- [x] Seguimiento de pedidos
- [x] Historial completo de compras
- [x] Gestión de direcciones de envío

---

## 🎯 ¿Por qué Elegir LYM?

### 💎 **Calidad Premium**
Trabajamos exclusivamente con materiales de alta calidad, como nuestro cuero genuino italiano, garantizando productos duraderos y elegantes.

### 🎨 **Personalización Única**
Cada producto puede ser customizado según tus preferencias, creando piezas únicas que reflejan tu personalidad.

### 🚀 **Tecnología Moderna**
Utilizamos las últimas tecnologías web para ofrecer una experiencia de usuario fluida, rápida y segura.

### 🌍 **Accesibilidad Global**
Con soporte multiidioma y integración de APIs internacionales, LYM está diseñado para usuarios de todo el mundo.

---

## 🔧 Instalación y Configuración

### Prerrequisitos
- PHP 8.2 o superior
- MySQL 5.7 o superior
- Node.js 16+ y npm
- Composer

### Configuración del Backend
```bash
# Clonar el repositorio
git clone https://git.isw.utn.ac.cr/tu-usuario/lym-project.git

# Instalar dependencias de PHP
composer install

# Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales de BD

# Ejecutar migraciones
php artisan migrate
```

### Configuración del Frontend
```bash
# Ir al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

---

## 📊 Estado del Proyecto

![Progress](https://img.shields.io/badge/Progreso-85%25-brightgreen?style=for-the-badge)

- ✅ **Backend API**: Completo
- ✅ **Frontend Base**: Completo
- ✅ **Autenticación**: Completo
- ✅ **Gestión de Productos**: Completo
- ✅ **Carrito de Compras**: Completo
- ✅ **Sistema de Pedidos**: Completo
- 🔄 **Internacionalización**: En desarrollo
- 🔄 **Testing**: En desarrollo

---

## 🤝 Contribuciones

Este proyecto es parte del curso **ISW-613 Programación en Ambiente Web I** de la Universidad Técnica Nacional de Costa Rica.

### Profesor
**Roosvelt Reyes Pérez** - Supervisor del proyecto

---

## 📄 Licencia

Este proyecto está desarrollado con fines académicos para el curso ISW-613.

---

## 🔗 Enlaces Importantes

- 📁 **Repositorio**: [GitLab UTN](https://git.isw.utn.ac.cr)
- 📧 **Contacto**: [nayeliarrieta02@gmail.com](mailto:nayeliarrieta02@gmail.com)

---

<div align="center">

**¿Listo para expresar tu estilo único?**

[![Visitar LYM](https://img.shields.io/badge/Visitar-LYM-purple?style=for-the-badge&logo=shopping-cart)](https://tu-dominio.com)

*Desarrollado con ❤️ por el equipo LYM*

</div>
