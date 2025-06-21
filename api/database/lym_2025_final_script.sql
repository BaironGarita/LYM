-- ================================================================
-- BASE DE DATOS OPTIMIZADA PARA E-COMMERCE
-- Esquema basado en los requisitos del usuario, aplicando 3FN y
-- buenas prácticas para desarrolladores.
-- ================================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS lym_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE lym_db;

-- ================================================================
-- 1. TABLA DE USUARIOS (Autenticación y Autorización)
-- ================================================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- Se debe almacenar un hash
    rol ENUM('administrador', 'cliente') NOT NULL DEFAULT 'cliente',
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
);

-- ================================================================
-- 2. TABLA DE CATEGORÍAS (Predeterminadas)
-- ================================================================
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    INDEX idx_nombre_categoria (nombre)
);

-- ================================================================
-- 3. TABLA DE ETIQUETAS (Reutilizables)
-- ================================================================
CREATE TABLE etiquetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_nombre_etiqueta (nombre)
);

-- ================================================================
-- 4. TABLA DE PRODUCTOS
-- ================================================================
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE, -- Para baja lógica
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_nombre_producto (nombre),
    INDEX idx_categoria_id (categoria_id)
);

-- ================================================================
-- 5. TABLA DE IMÁGENES DE PRODUCTOS
-- ================================================================
CREATE TABLE producto_imagenes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    url_imagen VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    orden INT DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto_id_imagenes (producto_id)
);

-- ================================================================
-- 6. PRODUCTOS-ETIQUETAS (Many-to-Many)
-- ================================================================
CREATE TABLE producto_etiquetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    etiqueta_id INT NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE,
    UNIQUE KEY uk_producto_etiqueta (producto_id, etiqueta_id)
);

-- ================================================================
-- 7. TABLA DE OPCIONES DE PERSONALIZACIÓN
-- ================================================================
CREATE TABLE opciones_personalizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('Color', 'Talla', 'Material', 'Otro') NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- ================================================================
-- 8. VALORES DE PERSONALIZACIÓN
-- ================================================================
CREATE TABLE valores_personalizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opcion_id INT NOT NULL,
    valor VARCHAR(100) NOT NULL,
    precio_adicional DECIMAL(8, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (opcion_id) REFERENCES opciones_personalizacion(id) ON DELETE CASCADE
);

-- ================================================================
-- 9. TABLA INTERMEDIA: PRODUCTOS-PERSONALIZACIÓN
-- ================================================================
CREATE TABLE producto_personalizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    opcion_id INT NOT NULL,
    obligatorio BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (opcion_id) REFERENCES opciones_personalizacion(id) ON DELETE CASCADE,
    UNIQUE KEY uk_producto_opcion (producto_id, opcion_id)
);

-- ================================================================
-- 10. TABLA DE PROMOCIONES
-- ================================================================
CREATE TABLE promociones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    tipo ENUM('categoria', 'producto') NOT NULL,
    categoria_id INT NULL,
    producto_id INT NULL,
    porcentaje DECIMAL(5, 2) NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_fechas_promo (fecha_inicio, fecha_fin),
    CHECK (
        (tipo = 'categoria' AND categoria_id IS NOT NULL AND producto_id IS NULL) OR
        (tipo = 'producto' AND producto_id IS NOT NULL AND categoria_id IS NULL)
    )
);

-- ================================================================
-- 11. TABLA DE DIRECCIONES
-- ================================================================
CREATE TABLE direcciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion_1 VARCHAR(255) NOT NULL,
    direccion_2 VARCHAR(255),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id_direcciones (usuario_id)
);

-- ================================================================
-- 12. TABLA DE CARRITOS
-- ================================================================
CREATE TABLE carritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id_carritos (usuario_id)
);

-- ================================================================
-- 13. TABLA DE ITEMS DEL CARRITO
-- ================================================================
CREATE TABLE carrito_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    carrito_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Captura el precio al momento de agregar
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY uk_carrito_producto (carrito_id, producto_id)
);

-- ================================================================
-- 14. TABLA DE PEDIDOS
-- ================================================================
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    direccion_envio_id INT NOT NULL,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    subtotal DECIMAL(12, 2) NOT NULL,
    descuento DECIMAL(12, 2) DEFAULT 0.00,
    impuestos DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (direccion_envio_id) REFERENCES direcciones(id),
    INDEX idx_usuario_id_pedidos (usuario_id),
    INDEX idx_estado_pedido (estado)
);

-- ================================================================
-- 15. TABLA DE ITEMS DEL PEDIDO
-- ================================================================
CREATE TABLE pedido_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL, -- Snapshot del nombre del producto
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Snapshot del precio
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_pedido_id_items (pedido_id)
);

-- ================================================================
-- 16. TABLA DE HISTORIAL DE ESTADOS DEL PEDIDO
-- ================================================================
CREATE TABLE pedido_historial_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    usuario_cambio_id INT, -- Puede ser NULL si el cambio es automático
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_cambio_id) REFERENCES usuarios(id),
    INDEX idx_pedido_id_historial (pedido_id)
);

-- ================================================================
-- 17. TABLA DE RESEÑAS
-- ================================================================
CREATE TABLE resenas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    pedido_id INT NOT NULL, -- Para validar que el usuario compró el producto
    valoracion INT NOT NULL CHECK (valoracion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    UNIQUE KEY uk_usuario_producto_resena (usuario_id, producto_id, pedido_id),
    INDEX idx_producto_id_resenas (producto_id)
);

-- ===============================================================-
-- DATOS INICIALES
-- ===============================================================-

-- Insertar categorías principales de moda
INSERT INTO categorias (nombre, descripcion, icono, color, orden) VALUES
('Bolsos', 'Bolsos y carteras de cuero artesanal', 'fas fa-handbag', '#8B4513', 1),
('Accesorios', 'Accesorios de moda y complementos', 'fas fa-gem', '#FFD700', 2),
('Billeteras', 'Billeteras y portafolios de cuero', 'fas fa-wallet', '#2F4F4F', 3),
('Cinturones', 'Cinturones de cuero premium', 'fas fa-circle', '#A0522D', 4),
('Joyas', 'Joyería artesanal y exclusiva', 'fas fa-ring', '#C0C0C0', 5);

-- Insertar etiquetas para productos de moda
INSERT INTO etiquetas (nombre) VALUES
('Premium'),
('Artesanal'),
('Cuero Italiano'),
('Hecho a Mano'),
('Exclusivo'),
('Personalizable'),
('Vintage'),
('Clásico'),
('Moderno'),
('Elegante');

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Administrador LYM', 'admin@lym.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador');

-- Insertar producto estrella: Bolso Milano
INSERT INTO productos (
    nombre, 
    descripcion, 
    precio, 
    categoria_id, 
    stock, 
    sku, 
    peso, 
    dimensiones, 
    material, 
    color_principal, 
    genero, 
    temporada
) VALUES (
    'Bolso Milano Premium',
    'Nuestro producto estrella: Bolso de cuero artesanal italiano con múltiples opciones de personalización. Elaborado con cuero genuino de la más alta calidad.',
    299.99,
    1,
    50,
    'LYM-MILANO-001',
    0.75,
    '30cm x 25cm x 15cm',
    'Cuero genuino italiano',
    'Negro Premium',
    'unisex',
    'todo_ano'
);

-- Asociar etiquetas al Bolso Milano
INSERT INTO producto_etiquetas (producto_id, etiqueta_id) VALUES
(1, 1), -- Premium
(1, 2), -- Artesanal
(1, 3), -- Cuero Italiano
(1, 4), -- Hecho a Mano
(1, 6); -- Personalizable

-- ===============================================================-
-- COMENTARIOS FINALES
-- ===============================================================-
-- Esta base de datos está diseñada para:
-- 1. E-commerce de moda y accesorios (según README.md)
-- 2. Gestión completa de productos con categorías y etiquetas
-- 3. Sistema de usuarios con roles
-- 4. Carrito de compras persistente
-- 5. Gestión de pedidos con historial
-- 6. Sistema de reseñas y valoraciones
-- 7. Promociones y descuentos automáticos
-- 8. Soporte para personalización de productos