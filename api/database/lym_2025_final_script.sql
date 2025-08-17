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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Bolsos Exclusivos','Bolsos de cuero premium con personalización','fas fa-handbag','#8B4513',1,1,'2025-06-21 04:25:50','2025-06-24 20:19:16'),(2,'Accesorios','Accesorios de moda y complementos','fas fa-gem','#FFD700',2,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(3,'Billeteras','Billeteras y portafolios de cuero','fas fa-wallet','#2F4F4F',3,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(4,'Cinturones','Cinturones de cuero premium','fas fa-circle','#A0522D',4,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(5,'Joyas','Joyería artesanal y exclusiva','fas fa-ring','#C0C0C0',5,1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(6,'Camisetas','Camisetas exclusivas','fas fa-handbag','#8B4513',1,1,'2025-06-22 05:32:25','2025-07-06 04:58:42'),(14,'Nuevo','','','',0,1,'2025-08-16 23:20:27','2025-08-16 23:33:44');
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (7,4,'San José','San José Centro','Avenida Central, Casa 123','Apartamento 2B','10101','2234-5678',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(8,5,'Alajuela','Alajuela Centro','Calle 5, Casa 456',NULL,'20101','2445-7890',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(9,6,'Cartago','Cartago Centro','Avenida 2, Edificio Los Robles','Oficina 301','30101','2551-2345',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(10,7,'Heredia','Heredia Centro','Calle Principal 789',NULL,'40101','2260-6789',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(11,8,'Puntarenas','Puntarenas Centro','Paseo de los Turistas 321','Local 15','60101','2661-4567',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(12,9,'Guanacaste','Liberia','Barrio La Victoria, Casa 654',NULL,'50101','2666-8901',1,1,'2025-07-10 01:27:58','2025-07-10 01:27:58'),(13,3,'Carrillos','Carrillos','100m Norte y 150m Oeste del Liceo Carrillos de poas',NULL,'20804','87889979',0,1,'2025-08-15 18:33:26','2025-08-15 18:33:26'),(14,3,'Alajuela','Carrillos','100m Norte x',NULL,'20804','87889979',0,1,'2025-08-16 02:28:54','2025-08-16 02:28:54'),(15,3,'Alajuela','Carrillos','100m Norte x',NULL,'20804','87889979',0,1,'2025-08-16 02:51:09','2025-08-16 02:51:09'),(16,3,'Alajuela','Carrillos','100m Norte y 150 X',NULL,'20804','87889979',0,1,'2025-08-16 03:04:13','2025-08-16 03:04:13'),(17,3,'Alajuela','Carrillos','100m X',NULL,'20804','87889979',0,1,'2025-08-16 16:14:04','2025-08-16 16:14:04'),(18,3,'Alajuela','Carrillos','100m X',NULL,'20804','87889979',0,1,'2025-08-16 16:22:09','2025-08-16 16:22:09'),(19,3,'Alajuela','Carrillos','100m X',NULL,'20804','87889979',0,1,'2025-08-16 16:22:19','2025-08-16 16:22:19'),(20,3,'Alajuela','Carrillos','100m X',NULL,'20804','87889979',0,1,'2025-08-16 16:27:31','2025-08-16 16:27:31'),(21,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 16:53:37','2025-08-16 16:53:37'),(22,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 17:01:01','2025-08-16 17:01:01'),(23,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 17:03:25','2025-08-16 17:03:25'),(24,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 17:22:06','2025-08-16 17:22:06'),(25,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 17:26:35','2025-08-16 17:26:35'),(26,3,'San Jose','San jose','100m de x',NULL,'10804','87889979',0,1,'2025-08-16 18:15:04','2025-08-16 18:15:04'),(27,3,'Alajuela','Poas','100m ',NULL,'30804','87889979',0,1,'2025-08-16 18:25:32','2025-08-16 18:25:32'),(28,3,'Alajuela','Poas','100m ',NULL,'30804','87889979',0,1,'2025-08-16 18:31:31','2025-08-16 18:31:31'),(29,3,'Alajuela','Poas','100m ',NULL,'30804','87889979',0,1,'2025-08-16 18:36:42','2025-08-16 18:36:42'),(30,3,'Alajuela','Poas','100m ',NULL,'30804','87889979',0,1,'2025-08-16 18:40:31','2025-08-16 18:40:31'),(31,3,'San Jose','Alajuela','100m Norte y 150m Del palo x',NULL,'20203','87889979',0,1,'2025-08-16 21:33:37','2025-08-16 21:33:37'),(32,3,'max','Poas','X ...',NULL,'20200','20204040',0,1,'2025-08-16 21:40:17','2025-08-16 21:40:17'),(33,3,'dads','adas','sdad',NULL,'20202','202020222',0,1,'2025-08-16 22:55:42','2025-08-16 22:55:42'),(34,3,'dasdasd','dasda','asdas',NULL,'12334','20202020',0,1,'2025-08-16 23:32:19','2025-08-16 23:32:19');
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
INSERT INTO `etiquetas` VALUES (1,'Premium Actualizado',1,'2025-06-21 04:25:50','2025-06-22 03:16:05'),(2,'Artesanal',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(3,'Cuero Italiano',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(4,'Hecho a Mano',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(5,'Exclusivo',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(6,'Personalizable',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(7,'Vintage',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(8,'Clásico',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(9,'Moderno',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(10,'Elegante',1,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(11,'Premium',1,'2025-06-22 03:16:39','2025-06-22 03:16:39'),(12,'Lujo',1,'2025-06-22 03:17:03','2025-08-16 23:33:20'),(14,'camisas',2,'2025-06-22 03:17:30','2025-06-22 03:17:30');
/*!40000 ALTER TABLE `etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extras`
--

DROP TABLE IF EXISTS `extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nombre` (`nombre`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extras`
--

LOCK TABLES `extras` WRITE;
/*!40000 ALTER TABLE `extras` DISABLE KEYS */;
/*!40000 ALTER TABLE `extras` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalles`
--

LOCK TABLES `pedido_detalles` WRITE;
/*!40000 ALTER TABLE `pedido_detalles` DISABLE KEYS */;
INSERT INTO `pedido_detalles` VALUES (5,7,1,1,30000.00,30000.00,NULL,'2025-07-10 01:45:46'),(6,7,5,1,7500.00,7500.00,NULL,'2025-07-10 01:45:46'),(7,8,6,1,8000.00,8000.00,NULL,'2025-07-10 01:45:46'),(8,8,4,2,5500.00,11000.00,NULL,'2025-07-10 01:45:46'),(9,9,1,2,30000.00,60000.00,NULL,'2025-07-10 01:45:46'),(10,9,4,1,5500.00,5500.00,NULL,'2025-07-10 01:45:46'),(11,9,5,1,7500.00,7500.00,NULL,'2025-07-10 01:45:46'),(12,10,2,2,10000.00,20000.00,NULL,'2025-07-10 01:45:47'),(13,11,1,1,30000.00,30000.00,NULL,'2025-07-10 01:46:29'),(14,11,7,2,5000.00,10000.00,NULL,'2025-07-10 01:46:29'),(15,11,4,1,5500.00,5500.00,NULL,'2025-07-10 01:46:29'),(17,19,7,2,5000.00,10000.00,NULL,'2025-08-16 21:33:38'),(18,20,5,5,7500.00,37500.00,NULL,'2025-08-16 21:40:18'),(19,21,4,2,5500.00,11000.00,NULL,'2025-08-16 22:55:43'),(20,22,4,1,5500.00,5500.00,NULL,'2025-08-16 23:32:20');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_historial`
--

LOCK TABLES `pedido_historial` WRITE;
/*!40000 ALTER TABLE `pedido_historial` DISABLE KEYS */;
INSERT INTO `pedido_historial` VALUES (1,7,NULL,'en_proceso','Pedido creado','2025-01-05 16:30:00'),(2,7,'en_proceso','confirmado','Pedido confirmado por el cliente','2025-01-06 14:15:00'),(3,7,'confirmado','pagado','Pago procesado exitosamente','2025-01-06 20:30:00'),(4,7,'pagado','enviado','Paquete enviado','2025-01-07 20:30:00'),(5,7,'enviado','entregado','Entrega confirmada','2025-01-08 20:20:00'),(6,8,NULL,'en_proceso','Pedido creado','2025-01-06 21:45:00'),(7,8,'en_proceso','confirmado','Pedido confirmado','2025-01-07 16:20:00'),(8,8,'confirmado','pagado','Pago con SINPE Móvil confirmado','2025-01-08 15:00:00'),(9,8,'pagado','enviado','En camino al destino','2025-01-09 15:15:00'),(10,9,NULL,'en_proceso','Pedido creado','2025-01-07 17:20:00'),(11,9,'en_proceso','confirmado','Confirmado - pedido grande','2025-01-07 22:30:00'),(12,9,'confirmado','pagado','Transferencia bancaria recibida','2025-01-08 22:30:00'),(13,10,NULL,'en_proceso','Pedido creado','2025-01-08 15:15:00'),(14,10,'en_proceso','confirmado','Confirmado por el cliente','2025-01-08 22:45:00'),(15,11,NULL,'en_proceso','Pedido creado','2025-01-04 20:00:00'),(16,11,'en_proceso','confirmado','Confirmado','2025-01-05 15:30:00'),(17,11,'confirmado','pagado','Pago en efectivo programado','2025-01-05 17:15:00'),(18,11,'pagado','enviado','Enviado con envío gratis','2025-01-06 17:15:00'),(19,11,'enviado','entregado','Entregado y pagado en efectivo','2025-01-07 18:45:00'),(20,12,NULL,'en_proceso','Pedido creado','2025-01-03 22:30:00'),(21,12,'en_proceso','cancelado','Cancelado por el cliente','2025-01-05 16:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (7,3,7,38998.00,5070.00,2000.00,0.00,46068.00,'entregado','tarjeta_credito',NULL,'2025-01-05 16:30:00','2025-01-08 20:20:00'),(8,4,8,21498.00,2795.00,1500.00,2300.00,23493.00,'enviado','sinpe_movil',NULL,'2025-01-06 21:45:00','2025-01-09 15:15:00'),(9,5,9,67997.00,8840.00,0.00,6800.00,70037.00,'pagado','transferencia',NULL,'2025-01-07 17:20:00','2025-01-08 22:30:00'),(10,6,10,17999.00,2340.00,1500.00,0.00,21839.00,'confirmado','tarjeta_debito',NULL,'2025-01-08 15:15:00','2025-01-08 22:45:00'),(11,7,11,39997.00,5200.00,0.00,4000.00,41197.00,'entregado','efectivo',NULL,'2025-01-04 20:00:00','2025-01-07 18:45:00'),(12,8,12,19498.00,2535.00,1500.00,0.00,23533.00,'cancelado','tarjeta_credito',NULL,'2025-01-03 22:30:00','2025-01-05 16:00:00'),(13,3,13,13000.00,0.00,0.00,0.00,13000.00,'en_proceso','transferencia',NULL,'2025-08-15 18:33:27','2025-08-15 18:33:27'),(18,3,30,5000.00,650.00,0.00,0.00,5650.00,'',NULL,NULL,'2025-08-16 18:42:01','2025-08-16 18:42:01'),(19,3,31,10000.00,1300.00,0.00,0.00,11300.00,'',NULL,NULL,'2025-08-16 21:33:38','2025-08-16 21:33:38'),(20,3,32,37500.00,4875.00,0.00,0.00,42375.00,'',NULL,NULL,'2025-08-16 21:40:18','2025-08-16 21:40:18'),(21,3,33,11000.00,1430.00,0.00,0.00,12430.00,'',NULL,NULL,'2025-08-16 22:55:43','2025-08-16 22:55:43'),(22,3,34,5500.00,715.00,0.00,0.00,6215.00,'',NULL,NULL,'2025-08-16 23:32:20','2025-08-16 23:32:20');
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
-- Table structure for table `producto_extras`
--

DROP TABLE IF EXISTS `producto_extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_extras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `extra_id` int(11) NOT NULL,
  `obligatorio` tinyint(1) DEFAULT 0,
  `multiple` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_producto_extra` (`producto_id`,`extra_id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_extra` (`extra_id`),
  CONSTRAINT `fk_producto_extras_extra` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_producto_extras_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_extras`
--

LOCK TABLES `producto_extras` WRITE;
/*!40000 ALTER TABLE `producto_extras` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_extras` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_imagenes`
--

LOCK TABLES `producto_imagenes` WRITE;
/*!40000 ALTER TABLE `producto_imagenes` DISABLE KEYS */;
INSERT INTO `producto_imagenes` VALUES (1,1,'bolso.webp','uploads/bolso.webp','Bolso de moda',1,1,'2025-07-06 19:02:47'),(2,2,'camiseta.jpg','uploads/camiseta.jpg','Camiseta oversize',1,1,'2025-07-06 19:34:16'),(3,4,'gafas.jpg','uploads/gafas.jpg','Gafas de moda',1,1,'2025-07-06 19:38:19'),(4,5,'bi2.webp','uploads/bi2.webp','Cartera de cuero',1,1,'2025-07-06 19:39:33'),(5,6,'cinturon.jpg','uploads/cinturon.jpg','Cinturon de cuero',1,1,'2025-07-06 19:41:49'),(6,7,'collar.jpg','uploads/collar.jpg','Collar de moda',1,1,'2025-07-06 19:42:53'),(7,5,'bi.webp','uploads/bi.webp','Cartera de cuero',1,1,'2025-07-06 21:56:55'),(8,29,'prodimg_68a242eca605c.avif','uploads/prodimg_68a242eca605c.avif','Camistea.avif',0,0,'2025-08-18 05:01:01'),(9,33,'prodimg_68a249c1c47af.jpeg','uploads/prodimg_68a249c1c47af.jpeg','Polo.jpeg',0,0,'2025-08-17 21:29:40');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Bolso Milano Premium','Nuestro producto estrella: Bolso de cuero artesanal italiano con múltiples opciones de personalización. Elaborado con cuero genuino de la más alta calidad.',30000.00,1,50,'LYM-MILANO-001',0.75,'30cm x 25cm x 15cm','Cuero genuino italiano','Negro Premium','unisex','Todo el año',0,'2025-06-21 04:25:50','2025-07-06 22:46:20'),(2,'Camisetas oversize','Camisetas oversize con opciones de personalización',10000.00,6,50,'LYM-CAMISETAS',0.00,'61-63cm','Algodón 100% peinado','Blanca','unisex','Todo el año',0,'2025-07-06 04:52:01','2025-07-06 22:47:16'),(4,'Gafas de Sol Polarizadas','Gafas de sol con protección UV400 y diseño elegante, ideales para cualquier temporada.',5500.00,2,97,'LYM-GAFAS-001',0.15,'14cm x 5cm x 4cm','Acetato y metal','Negro','unisex','verano',0,'2025-07-06 05:03:13','2025-08-16 23:32:20'),(5,'Billetera Classic Slim','Billetera de cuero genuino con diseño minimalista y compartimentos para tarjetas y billetes.',7500.00,3,70,'LYM-BILL-001',0.20,'11cm x 9cm x 1cm','Cuero legítimo','Marrón','femenino','Todo el año',0,'2025-07-06 05:03:24','2025-08-16 21:40:18'),(6,'Cinturón Ejecutivo Cuero','Cinturón de cuero italiano con hebilla metálica premium, ideal para uso formal o casual.',8000.00,4,60,'LYM-CINT-001',0.35,'110cm x 3.5cm','Cuero genuino italiano','Negro','masculino','Todo el año',0,'2025-07-06 05:03:35','2025-07-06 22:47:31'),(7,'Collar Minimalista Plata','Collar elegante de plata 925 con dije minimalista, perfecto para ocasiones casuales o elegantes.',5000.00,5,38,'LYM-JOY-001',0.05,'45cm','Plata 925','Plateado','femenino','Todo el año',0,'2025-07-06 05:03:46','2025-08-16 21:33:38'),(8,'Camiseta Polo','La mejor camiseta polo',10000.00,6,10,'LYM-02EEEC2D',0.00,'','','','unisex','',1,'2025-07-27 03:44:02','2025-07-27 04:08:26'),(9,'Prueba','Prueba',1000.00,6,10,'LYM-1FECE139',0.70,'S','Algodon','','','Verano',1,'2025-07-27 03:50:22','2025-07-27 04:08:16'),(10,'Camiseta Polo','Hermosa camiseta polo',8500.00,6,10,'LYM-69755CDD',0.70,'S','Algodon','','','Verano',1,'2025-07-27 04:09:59','2025-07-27 04:10:26'),(11,'Camisa Polo','Prueba',10000.00,6,10,'LYM-EAF58D58',0.70,'S','Algodon','','','Verano',1,'2025-07-28 04:38:07','2025-07-28 04:49:56'),(12,'Camisa Tipo polo','Una camisa clasica y con un estilo unico',12000.00,6,100,'LYM-E55EFEEE',0.70,'','Algodon','','','Verano',1,'2025-08-15 16:20:38','2025-08-15 16:34:38'),(13,'Camisa polo','Camisa tipo polo excelente',12000.00,6,100,'LYM-1E28EF27',0.70,'','Algodon','','','Verano',1,'2025-08-15 16:35:46','2025-08-15 16:50:01'),(14,'Camisa Tipo polo','Nuevo ingres',12000.00,6,100,'LYM-56613425',0.70,'','Algodon','','','Verano',1,'2025-08-15 16:50:46','2025-08-15 16:52:54'),(15,'Camisa Polo','Nuevo ingreso',12.00,6,100,'LYM-6D1D428C',0.70,'','Algodon','','','Verano',1,'2025-08-15 16:56:59','2025-08-15 17:01:59'),(16,'Camisa Polo','Nuevo ingreso',12000.00,6,100,'LYM-8388BC31',0.70,'S,M,L','Algodon','','','Verano',1,'2025-08-15 17:02:48','2025-08-15 17:04:08'),(17,'Camisa Polo','Nuevo Ingreso',12000.00,6,100,'LYM-8C6D18AB',0.70,'S,M,L,XL','Algodon','','','Verano',1,'2025-08-15 17:05:10','2025-08-15 17:06:41'),(18,'Camisa Polo','Nuevo Ingreso',12000.00,6,100,'LYM-90C1CAA2',0.70,'S,M,L,XL','Algodon','','','Verano',1,'2025-08-15 17:06:20','2025-08-15 17:06:45'),(19,'Camisa Polo','Nuevo ingreso',12000.00,6,100,'LYM-EBBAD8E5',0.00,NULL,NULL,NULL,'unisex',NULL,1,'2025-08-15 17:30:35','2025-08-15 17:31:02'),(20,'Camisa Polo','Nuevo ',12000.00,6,100,'LYM-F050C5BA',0.00,NULL,NULL,NULL,'unisex',NULL,1,'2025-08-15 17:31:49','2025-08-17 04:06:15'),(21,'Camisa Polo','Nuevo ',12000.00,6,100,'LYM-8A40FB76',0.00,NULL,NULL,NULL,'unisex',NULL,1,'2025-08-15 18:12:52','2025-08-15 18:13:06'),(22,'Polo','Nueva',12000.00,14,20,'LYM-57AD1419',0.00,NULL,NULL,NULL,'unisex',NULL,1,'2025-08-17 04:07:22','2025-08-17 04:17:40'),(23,'Polo','Nuevo',12000.00,14,20,'LYM-82358EB7',0.00,NULL,NULL,NULL,'unisex',NULL,1,'2025-08-17 04:18:43','2025-08-17 04:44:20'),(24,'Polo','Nueva',12000.00,14,20,'LYM-E7A73279',0.70,'S, M, L, XL','Algodon','','','Verano',1,'2025-08-17 04:45:54','2025-08-17 20:26:23'),(25,'Polo','Nueva',12000.00,14,20,'LYM-CC101C2D',0.70,'S,M,L,XL','Algodon','','','Verano',1,'2025-08-17 20:34:09','2025-08-17 20:34:14'),(26,'Polo','Nueva',12000.00,14,10,'LYM-DAB18843',0.70,'S,M,L,XL','Algodon','','','Verano',1,'2025-08-17 20:38:07','2025-08-17 20:43:27'),(27,'Polo','Nueva',12000.00,14,100,'LYM-F9ED4630',0.70,'S,M','Algodon','','','Verano',1,'2025-08-17 20:46:27','2025-08-17 21:02:10'),(28,'Polo','Nueva',12000.00,14,100,'LYM-1AFBF835',0.70,'S,M','Algodon','','','Verano',1,'2025-08-17 20:55:30','2025-08-17 21:02:07'),(29,'Polo','Nueva',12000.00,14,100,'LYM-2BB71733',0.70,'S,M','Algodon','','','Verano',0,'2025-08-17 20:59:47','2025-08-17 20:59:47'),(30,'Polo Femenina','Nueva',10000.00,14,100,'LYM-638C247F',0.60,'XS, S, M, L','Algodon','','','Verano',1,'2025-08-17 21:14:32','2025-08-17 21:16:58'),(31,'Polo Femenina','Nuevo',10000.00,14,10,'LYM-80163400',0.70,'XS ,S, M, L ','Algodon','','','Verano',1,'2025-08-17 21:22:09','2025-08-17 21:30:05'),(32,'Polo Femenina','Nuevo',10000.00,14,10,'LYM-833783EC',0.70,'XS ,S, M, L ','Algodon','','','Verano',1,'2025-08-17 21:23:25','2025-08-17 21:30:01'),(33,'Polo Femenina','Nuevo',10000.00,14,10,'LYM-9C1B50DD',0.70,'XS ,S, M, L ','Algodon','','','Verano',0,'2025-08-17 21:29:37','2025-08-17 21:29:37');
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (1,'Promo de ejemplo','20% de descuento en producto de prueba','producto',1,NULL,20.00,0.00,0.00,'2025-07-07 00:43:55','2025-07-14 00:43:55',1,'2025-07-07 00:43:55'),(13,'Exclusive',NULL,'producto',1,NULL,50.00,0.00,0.00,'2025-07-27 06:00:00','2025-07-31 06:00:00',1,'2025-07-27 04:37:50');
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
  UNIQUE KEY `uk_usuario_producto_simple` (`usuario_id`,`producto_id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_valoracion` (`valoracion`),
  KEY `idx_aprobado` (`aprobado`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_ibfk_3` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (1,1,11,NULL,5,'Perfecto el mejor bolso de todos',1,'2025-07-11 23:45:33','2025-07-11 23:45:33'),(2,1,4,NULL,4,'Muy buen material y espacioso. Me encantó el color.',1,'2025-07-28 04:27:30','2025-07-28 04:27:30'),(3,2,5,NULL,5,'¡Excelente calidad! Justo lo que buscaba para un regalo.',1,'2025-07-28 04:27:59','2025-07-28 04:27:59'),(4,1,6,NULL,3,'El bolso es bonito, pero un poco más pequeño de lo que esperaba.',1,'2025-07-28 04:28:07','2025-07-28 04:28:07'),(6,2,8,NULL,4,'La billetera tiene un acabado muy elegante. Satisfecha con la compra.',1,'2025-07-28 04:28:45','2025-07-28 04:28:45'),(8,2,9,NULL,5,'Me encantó el diseño minimalista. El cuero se siente de muy alta calidad. La recomiendo.',1,'2025-07-28 04:31:46','2025-07-28 04:31:46'),(10,2,3,NULL,4,'Buena billetera, tiene el tamaño perfecto. El único detalle es que el color es un poco más oscuro que en la foto.',1,'2025-07-28 04:32:20','2025-07-28 04:32:20'),(11,2,4,NULL,5,'Fue un regalo para mi esposo y le fascinó. Muy elegante y funcional. Llegó en el tiempo estimado.',1,'2025-07-28 04:32:33','2025-07-28 04:32:33'),(12,2,6,NULL,3,'Es bonita, pero esperaba que tuviera más compartimentos para tarjetas. Por el precio.',1,'2025-07-28 04:33:42','2025-07-28 04:33:42'),(13,2,11,NULL,2,'Buena',1,'2025-07-28 04:47:55','2025-07-28 04:47:55'),(14,6,11,NULL,5,'Perfecto',1,'2025-07-29 21:05:46','2025-07-29 21:05:46'),(15,4,11,NULL,5,'Me encantan Ojala en otros colores',1,'2025-07-29 21:08:15','2025-07-29 21:08:15');
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador LYM','admin@lym.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'administrador',1,NULL,NULL,'2025-06-21 04:25:50','2025-06-21 04:25:50'),(3,'Bairon','Bairongaba@gmail.com','$2y$10$M76I0LgFpdJM35CiYJEaFuX/CyoJco8Oez6dXkR6USE/g958z.nRq',NULL,'administrador',1,NULL,NULL,'2025-07-08 22:11:02','2025-07-08 22:11:02'),(4,'María González','maria.gonzalez@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(5,'Carlos Rodríguez','carlos.rodriguez@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(6,'Ana Patricia Jiménez','ana.jimenez@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(7,'Roberto Vargas','roberto.vargas@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(8,'Laura Solís','laura.solis@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(9,'José Miguel Castro','jose.castro@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'cliente',1,NULL,NULL,'2025-07-10 01:26:25','2025-07-10 01:26:25'),(11,'Bairon','bairongarita@gmail.com','$2y$10$92znlA0jTYovvca.NVTn..C0DLbTOYzAhihlxrGvCP0Po3S3UeSmG',NULL,'cliente',1,NULL,NULL,'2025-07-11 23:45:04','2025-07-11 23:45:04');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-17 16:41:43
