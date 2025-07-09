-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: lym_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `personalizaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`personalizaciones`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_producto` (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `color` varchar(7) DEFAULT '#000000',
  `orden` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_activo` (`activo`),
  KEY `idx_orden` (`orden`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Bolsos Exclusivos','Bolsos de cuero premium con personalización','fas fa-handbag','#8B4513',1,1,'2025-06-21 04:25:50','2025-06-24 20:19:16'),(2,'Accesorios','Accesorios de moda y complementos','fas fa-gem','#FFD700',2,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(3,'Billeteras','Billeteras y portafolios de cuero','fas fa-wallet','#2F4F4F',3,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(4,'Cinturones','Cinturones de cuero premium','fas fa-circle','#A0522D',4,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(5,'Joyas','Joyería artesanal y exclusiva','fas fa-ring','#C0C0C0',5,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(6,'Camisetas','Camisetas exclusivas','fas fa-handbag','#8B4513',1,1,'2025-06-22 05:32:25','2025-07-06 04:58:42');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccion_1` varchar(255) NOT NULL,
  `direccion_2` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_principal` (`es_principal`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiquetas`
--

DROP TABLE IF EXISTS `etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiquetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiquetas`
--

LOCK TABLES `etiquetas` WRITE;
/*!40000 ALTER TABLE `etiquetas` DISABLE KEYS */;
INSERT INTO `etiquetas` VALUES (1,'Premium Actualizado',1,'2025-06-21 04:25:50','2025-06-22 03:16:05'),(2,'Artesanal',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(3,'Cuero Italiano',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(4,'Hecho a Mano',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(5,'Exclusivo',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(6,'Personalizable',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(7,'Vintage',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(8,'Clásico',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(9,'Moderno',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(10,'Elegante',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(11,'Premium',1,'2025-06-22 03:16:39','2025-06-22 03:16:39'),(12,'Moda',1,'2025-06-22 03:17:03','2025-06-22 03:17:03'),(14,'camisas',2,'2025-06-22 03:17:30','2025-06-22 03:17:30');
/*!40000 ALTER TABLE `etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalles`
--

DROP TABLE IF EXISTS `pedido_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `personalizaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`personalizaciones`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pedido` (`pedido_id`),
  KEY `idx_producto` (`producto_id`),
  CONSTRAINT `pedido_detalles_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_detalles_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalles`
--

LOCK TABLES `pedido_detalles` WRITE;
/*!40000 ALTER TABLE `pedido_detalles` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_historial`
--

DROP TABLE IF EXISTS `pedido_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_historial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `estado_anterior` varchar(20) DEFAULT NULL,
  `estado_nuevo` varchar(20) NOT NULL,
  `comentario` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pedido` (`pedido_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `pedido_historial_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_historial`
--

LOCK TABLES `pedido_historial` WRITE;
/*!40000 ALTER TABLE `pedido_historial` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `direccion_envio_id` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) DEFAULT 0.00,
  `envio` decimal(10,2) DEFAULT 0.00,
  `descuento` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('en_proceso','confirmado','pagado','enviado','entregado','cancelado') DEFAULT 'en_proceso',
  `metodo_pago` varchar(50) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `direccion_envio_id` (`direccion_envio_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`direccion_envio_id`) REFERENCES `direcciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_etiquetas`
--

DROP TABLE IF EXISTS `producto_etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_etiquetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `etiqueta_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_producto_etiqueta` (`producto_id`,`etiqueta_id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_etiqueta` (`etiqueta_id`),
  CONSTRAINT `producto_etiquetas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `producto_etiquetas_ibfk_2` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_etiquetas`
--

LOCK TABLES `producto_etiquetas` WRITE;
/*!40000 ALTER TABLE `producto_etiquetas` DISABLE KEYS */;
INSERT INTO `producto_etiquetas` VALUES (1,1,1,'2025-06-21 04:25:50'),(2,1,2,'2025-06-21 04:25:50'),(3,1,3,'2025-06-21 04:25:50'),(4,1,4,'2025-06-21 04:25:50'),(5,1,6,'2025-06-21 04:25:50');
/*!40000 ALTER TABLE `producto_etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_imagenes`
--

DROP TABLE IF EXISTS `producto_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_imagenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(500) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `es_principal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_orden` (`orden`),
  KEY `idx_principal` (`es_principal`),
  CONSTRAINT `producto_imagenes_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_imagenes`
--

LOCK TABLES `producto_imagenes` WRITE;
/*!40000 ALTER TABLE `producto_imagenes` DISABLE KEYS */;
INSERT INTO `producto_imagenes` VALUES (1,1,'bolso.webp','uploads/bolso.webp','Bolso de moda',1,1,'2025-07-06 19:02:47'),(2,2,'camiseta.jpg','uploads/camiseta.jpg','Camiseta oversize',1,1,'2025-07-06 19:34:16'),(3,4,'gafas.jpg','uploads/gafas.jpg','Gafas de moda',1,1,'2025-07-06 19:38:19'),(4,5,'bi2.webp','uploads/bi2.webp','Cartera de cuero',1,1,'2025-07-06 19:39:33'),(5,6,'cinturon.jpg','uploads/cinturon.jpg','Cinturon de cuero',1,1,'2025-07-06 19:41:49'),(6,7,'collar.jpg','uploads/collar.jpg','Collar de moda',1,1,'2025-07-06 19:42:53'),(7,5,'bi.webp','uploads/bi.webp','Cartera de cuero',1,1,'2025-07-06 21:56:55');
/*!40000 ALTER TABLE `producto_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `sku` varchar(50) DEFAULT NULL,
  `peso` decimal(8,2) DEFAULT 0.00,
  `dimensiones` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `color_principal` varchar(50) DEFAULT NULL,
  `genero` enum('masculino','femenino','unisex') DEFAULT 'unisex',
  `temporada` varchar(50) DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_categoria` (`categoria_id`),
  KEY `idx_precio` (`precio`),
  KEY `idx_eliminado` (`eliminado`),
  KEY `idx_stock` (`stock`),
  KEY `idx_genero` (`genero`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Bolso Milano Premium','Nuestro producto estrella: Bolso de cuero artesanal italiano con múltiples opciones de personalización. Elaborado con cuero genuino de la más alta calidad.',30000.00,1,50,'LYM-MILANO-001',0.75,'30cm x 25cm x 15cm','Cuero genuino italiano','Negro Premium','unisex','Todo el año',0,'2025-06-21 04:25:50','2025-07-06 22:46:20'),(2,'Camisetas oversize','Camisetas oversize con opciones de personalización',10000.00,6,50,'LYM-CAMISETAS',0.00,'61-63cm','Algodón 100% peinado','Blanca','unisex','Todo el año',0,'2025-07-06 04:52:01','2025-07-06 22:47:16'),(4,'Gafas de Sol Polarizadas','Gafas de sol con protección UV400 y diseño elegante, ideales para cualquier temporada.',5500.00,2,100,'LYM-GAFAS-001',0.15,'14cm x 5cm x 4cm','Acetato y metal','Negro','unisex','verano',0,'2025-07-06 05:03:13','2025-07-06 22:36:35'),(5,'Billetera Classic Slim','Billetera de cuero genuino con diseño minimalista y compartimentos para tarjetas y billetes.',7500.00,3,75,'LYM-BILL-001',0.20,'11cm x 9cm x 1cm','Cuero legítimo','Marrón','femenino','Todo el año',0,'2025-07-06 05:03:24','2025-07-06 22:47:24'),(6,'Cinturón Ejecutivo Cuero','Cinturón de cuero italiano con hebilla metálica premium, ideal para uso formal o casual.',8000.00,4,60,'LYM-CINT-001',0.35,'110cm x 3.5cm','Cuero genuino italiano','Negro','masculino','Todo el año',0,'2025-07-06 05:03:35','2025-07-06 22:47:31'),(7,'Collar Minimalista Plata','Collar elegante de plata 925 con dije minimalista, perfecto para ocasiones casuales o elegantes.',5000.00,5,40,'LYM-JOY-001',0.05,'45cm','Plata 925','Plateado','femenino','Todo el año',0,'2025-07-06 05:03:46','2025-07-06 22:47:37');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` enum('producto','categoria','total') NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT 0.00,
  `monto_fijo` decimal(10,2) DEFAULT 0.00,
  `monto_minimo` decimal(10,2) DEFAULT 0.00,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_activo` (`activo`),
  KEY `idx_fechas` (`fecha_inicio`,`fecha_fin`),
  CONSTRAINT `promociones_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promociones_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (1,'Promo de ejemplo','20% de descuento en producto de prueba','producto',1,NULL,20.00,0.00,0.00,'2025-07-07 00:43:55','2025-07-14 00:43:55',1,'2025-07-07 00:43:55');
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `pedido_id` int(11) DEFAULT NULL,
  `valoracion` tinyint(1) NOT NULL CHECK (`valoracion` >= 1 and `valoracion` <= 5),
  `comentario` text DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_valoracion` (`valoracion`),
  KEY `idx_aprobado` (`aprobado`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_ibfk_3` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

-- Ejemplo 1: Reseña básica (los campos created_at y updated_at se llenan automáticamente)
INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado, created_at) 
VALUES (1, 1, 5, 'Producto excelente, muy recomendado!', 1, '2025-05-01 15:30:00');

-- Ejemplo 2: Reseña con fecha específica
INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado, created_at) 
VALUES (2, 2, 4, 'Buena calidad, llegó rápido', 1, '2025-07-08 15:30:00');

-- Ejemplo 3: Reseña pendiente de aprobación
INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado, created_at) 
VALUES (4, 3, 3, 'Las gafas están bien pero esperaba más', 0, '2025-01-015 13:30:00');

INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado, created_at) 
VALUES (5, 4, 5, 'Billetera perfecta, justo lo que buscaba', 1, '2025-03-08 14:00:00');

INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado, created_at) 
VALUES (6, 5, 4, 'Cinturón de buena calidad', 1, '2025-06-25 15:00:00');

INSERT INTO resenas (producto_id, usuario_id, valoracion, comentario, aprobado) 
VALUES (7, 6, 5, 'Collar hermoso, llegó bien empacado', 1);
--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('administrador','cliente') DEFAULT 'cliente',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('masculino','femenino','otro','prefiero_no_decir') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_correo` (`correo`),
  KEY `idx_rol` (`rol`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador LYM','admin@lym.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'administrador',1,NULL,NULL,'2025-06-21 04:25:50','2025-06-21 04:25:50');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'lym_db'
--

--
-- Dumping routines for database 'lym_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 11:45:28
