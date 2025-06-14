-- ================================================================
-- BASE DE DATOS LYM - LOOK YOUR MOOD
-- Sistema de E-commerce para Moda y Accesorios
-- Actualizado según README.md - Dominio de moda
-- ================================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS lym_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE lym_db;

-- ================================================================
-- TABLA: CATEGORÍAS DE PRODUCTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    color VARCHAR(7) DEFAULT '#000000',
    orden INT DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo),
    INDEX idx_orden (orden)
);

-- ================================================================
-- TABLA: ETIQUETAS (TAGS) PARA PRODUCTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
);

-- ================================================================
-- TABLA: PRODUCTOS PRINCIPALES
-- ================================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    stock INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    peso DECIMAL(8,2) DEFAULT 0.00,
    dimensiones VARCHAR(100),
    material VARCHAR(100),
    color_principal VARCHAR(50),
    genero ENUM('masculino', 'femenino', 'unisex') DEFAULT 'unisex',
    temporada ENUM('primavera', 'verano', 'otono', 'invierno', 'todo_ano') DEFAULT 'todo_ano',
    eliminado TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    INDEX idx_categoria (categoria_id),
    INDEX idx_precio (precio),
    INDEX idx_eliminado (eliminado),
    INDEX idx_stock (stock),
    INDEX idx_genero (genero),
    INDEX idx_created_at (created_at)
);

-- ================================================================
-- TABLA: RELACIÓN PRODUCTO-ETIQUETAS (MUCHOS A MUCHOS)
-- ================================================================
CREATE TABLE IF NOT EXISTS producto_etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    etiqueta_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_producto_etiqueta (producto_id, etiqueta_id),
    INDEX idx_producto (producto_id),
    INDEX idx_etiqueta (etiqueta_id)
);

-- ================================================================
-- TABLA: IMÁGENES DE PRODUCTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    orden INT DEFAULT 0,
    es_principal TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_orden (orden),
    INDEX idx_principal (es_principal)
);

-- ================================================================
-- TABLA: USUARIOS DEL SISTEMA
-- ================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('administrador', 'cliente') DEFAULT 'cliente',
    activo TINYINT(1) DEFAULT 1,
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
);

-- ================================================================
-- TABLA: DIRECCIONES DE USUARIOS
-- ================================================================
CREATE TABLE IF NOT EXISTS direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion_1 VARCHAR(255) NOT NULL,
    direccion_2 VARCHAR(255),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(20),
    es_principal TINYINT(1) DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_principal (es_principal)
);

-- ================================================================
-- TABLA: PEDIDOS
-- ================================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion_envio_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0.00,
    envio DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('en_proceso', 'confirmado', 'pagado', 'enviado', 'entregado', 'cancelado') DEFAULT 'en_proceso',
    metodo_pago VARCHAR(50),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (direccion_envio_id) REFERENCES direcciones(id) ON DELETE RESTRICT,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_created_at (created_at)
);

-- ================================================================
-- TABLA: DETALLE DE PEDIDOS
-- ================================================================
CREATE TABLE IF NOT EXISTS pedido_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    personalizaciones JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    INDEX idx_pedido (pedido_id),
    INDEX idx_producto (producto_id)
);

-- ================================================================
-- TABLA: HISTORIAL DE ESTADOS DE PEDIDOS
-- ================================================================
CREATE TABLE IF NOT EXISTS pedido_historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    INDEX idx_pedido (pedido_id),
    INDEX idx_created_at (created_at)
);

-- ================================================================
-- TABLA: RESEÑAS Y VALORACIONES
-- ================================================================
CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    pedido_id INT,
    valoracion TINYINT(1) NOT NULL CHECK (valoracion >= 1 AND valoracion <= 5),
    comentario TEXT,
    aprobado TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    INDEX idx_producto (producto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_valoracion (valoracion),
    INDEX idx_aprobado (aprobado)
);

-- ================================================================
-- TABLA: CARRITO DE COMPRAS
-- ================================================================
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    personalizaciones JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_producto (usuario_id, producto_id),
    INDEX idx_usuario (usuario_id)
);

-- ================================================================
-- TABLA: PROMOCIONES Y DESCUENTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('producto', 'categoria', 'total') NOT NULL,
    producto_id INT NULL,
    categoria_id INT NULL,
    porcentaje DECIMAL(5,2) DEFAULT 0.00,
    monto_fijo DECIMAL(10,2) DEFAULT 0.00,
    monto_minimo DECIMAL(10,2) DEFAULT 0.00,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
);

-- ================================================================
-- DATOS INICIALES
-- ================================================================

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

-- ================================================================
-- COMENTARIOS FINALES
-- ================================================================
-- Esta base de datos está diseñada para:
-- 1. E-commerce de moda y accesorios (según README.md)
-- 2. Gestión completa de productos con categorías y etiquetas
-- 3. Sistema de usuarios con roles
-- 4. Carrito de compras persistente
-- 5. Gestión de pedidos con historial
-- 6. Sistema de reseñas y valoraciones
-- 7. Promociones y descuentos automáticos
-- 8. Soporte para personalización de productos
