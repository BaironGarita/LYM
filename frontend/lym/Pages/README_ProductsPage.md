# Página CRUD de Productos

Esta página proporciona una interfaz completa para la gestión de productos en la tienda LYM.

## Características

### ✨ Funcionalidades principales

- **Crear productos**: Formulario completo con todos los campos necesarios
- **Listar productos**: Tabla responsiva con información detallada
- **Editar productos**: Modificación de productos existentes
- **Eliminar productos**: Eliminación con confirmación
- **Búsqueda**: Filtrado por nombre de producto
- **Filtros**: Filtrado por categoría
- **Estadísticas**: Dashboard con métricas importantes

### 📊 Estadísticas incluidas

- Total de productos
- Valor del inventario
- Productos con stock bajo
- Productos sin stock
- Categoría más popular

### 🛠 Campos del producto

#### Información básica

- **Nombre**: Nombre del producto (requerido)
- **Descripción**: Descripción detallada
- **Precio**: Precio del producto (requerido)
- **Stock**: Cantidad disponible
- **Categoría**: Categoría del producto (requerido)
- **SKU**: Código único del producto

#### Detalles específicos

- **Peso**: Peso en kilogramos
- **Dimensiones**: Medidas del producto
- **Material**: Material principal
- **Color principal**: Color predominante
- **Género**: Dirigido a (unisex, hombre, mujer, niño, niña)
- **Temporada**: Temporada de la colección
- **Imagen**: Imagen del producto
- **Etiquetas**: Etiquetas asociadas

## 🏗 Arquitectura

### Componentes

1. **ProductsPage.jsx**: Componente principal
2. **ProductFilters.jsx**: Componente de filtros
3. **ProductTable.jsx**: Tabla de productos
4. **ProductModal.jsx**: Modal para crear/editar
5. **ProductStats.jsx**: Estadísticas del dashboard

### Servicios

- **ProductoService.js**: Servicio para operaciones CRUD
  - `getProductos()`: Obtener todos los productos
  - `createProducto()`: Crear nuevo producto
  - `updateProducto()`: Actualizar producto
  - `deleteProducto()`: Eliminar producto
  - `validateProductData()`: Validar datos
  - Funciones auxiliares de formateo y validación

## 🚀 Uso

### Importar la página

```jsx
import ProductsPage from "../Pages/ProductsPage.jsx";
```

### Usar en rutas

```jsx
<Route path="/productos" element={<ProductsPage />} />
```

## 🔧 API Endpoints utilizados

- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto
- `GET /api/categorias` - Listar categorías
- `GET /api/etiquetas` - Listar etiquetas

## 📱 Responsive Design

La página está completamente optimizada para dispositivos móviles y desktop:

- Grid responsivo para estadísticas
- Tabla con scroll horizontal en móviles
- Modal adaptativo
- Formulario de dos columnas que se adapta

## 🎨 Estados de stock

- **En stock** (verde): Stock >= 10 unidades
- **Stock bajo** (amarillo): Stock < 10 y > 0 unidades
- **Sin stock** (rojo): Stock = 0 unidades

## 🔐 Autenticación

La página requiere autenticación y utiliza el hook `useAuth()` para:

- Verificar si el usuario está autenticado
- Obtener el token para las peticiones API
- Redirigir si no hay sesión activa

## 📝 Validaciones

### Validaciones del cliente

- Nombre del producto (requerido)
- Precio válido (requerido, >= 0)
- Categoría seleccionada (requerido)
- Stock numérico (>= 0)
- Peso numérico (>= 0)

### Validaciones del servidor

Se envían los datos al servidor que realiza validaciones adicionales según el modelo `ProductoModel.php`.

## 🎯 Mejoras futuras

- [ ] Exportación a CSV/Excel
- [ ] Importación masiva de productos
- [ ] Gestión de múltiples imágenes
- [ ] Configuración de variantes (tallas, colores)
- [ ] Historial de cambios de precios
- [ ] Alertas automáticas de stock bajo
- [ ] Integración con códigos de barras
- [ ] Análisis de tendencias de ventas

## 🐛 Manejo de errores

- Validación en tiempo real del formulario
- Mensajes de error descriptivos
- Manejo de errores de red
- Estados de carga y feedback visual
- Confirmaciones para acciones destructivas

## 📋 Dependencias

- React 18+
- Lucide React (iconos)
- Tailwind CSS (estilos)
- Hook personalizado `useAuth`

## 💡 Tips de uso

1. **Búsqueda rápida**: Usa la barra de búsqueda para encontrar productos por nombre
2. **Filtros**: Combina búsqueda con filtros de categoría para resultados más precisos
3. **Stock**: Los colores en la columna estado indican el nivel de stock
4. **Imágenes**: Sube imágenes en formatos web optimizados (WebP, JPG, PNG)
5. **SKU**: Si no proporcionas un SKU, el sistema puede generar uno automáticamente
