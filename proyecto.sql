-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: proyecto
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `actividad_imagenes`
--

DROP TABLE IF EXISTS `actividad_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad_imagenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actividad_id` int NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `actividad_id` (`actividad_id`),
  CONSTRAINT `actividad_imagenes_ibfk_1` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad_imagenes`
--

LOCK TABLES `actividad_imagenes` WRITE;
/*!40000 ALTER TABLE `actividad_imagenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividad_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades`
--

LOCK TABLES `actividades` WRITE;
/*!40000 ALTER TABLE `actividades` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivos_subidos`
--

DROP TABLE IF EXISTS `archivos_subidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivos_subidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_guardado` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `size` int NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivos_subidos`
--

LOCK TABLES `archivos_subidos` WRITE;
/*!40000 ALTER TABLE `archivos_subidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `archivos_subidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('Masculino','Femenino','Otro') NOT NULL,
  `tipo_cedula` varchar(20) DEFAULT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `cedula_escolar` varchar(20) NOT NULL,
  `representante_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula_escolar` (`cedula_escolar`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `representante_id` (`representante_id`),
  KEY `idx_estudiantes_cedula` (`cedula`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`representante_id`) REFERENCES `representantes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,'jugnfgh','veraras','3212-02-12','Masculino',NULL,'','2123231231233123',9,'2025-06-23 19:51:38'),(22,'hola','quetal','2122-03-12','Masculino',NULL,NULL,'20555844258',66,'2025-06-23 23:04:00'),(24,'josefina','perez','2020-02-10','Masculino',NULL,NULL,'102220002255',68,'2025-06-25 17:18:02'),(25,'ashdhashd','hsaidhahs','2123-03-12','Masculino',NULL,NULL,'12312312',69,'2025-06-26 20:06:27');
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grado_estudiantes`
--

DROP TABLE IF EXISTS `grado_estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado_estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_grado` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_grado` (`id_grado`,`id_estudiante`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `grado_estudiantes_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id`),
  CONSTRAINT `grado_estudiantes_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado_estudiantes`
--

LOCK TABLES `grado_estudiantes` WRITE;
/*!40000 ALTER TABLE `grado_estudiantes` DISABLE KEYS */;
INSERT INTO `grado_estudiantes` VALUES (12,2,25,'2025-06-27 02:08:00'),(13,2,24,'2025-06-27 02:08:01');
/*!40000 ALTER TABLE `grado_estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grados`
--

DROP TABLE IF EXISTS `grados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `seccion` varchar(10) NOT NULL,
  `id_profesor` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `grados_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `personal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grados`
--

LOCK TABLES `grados` WRITE;
/*!40000 ALTER TABLE `grados` DISABLE KEYS */;
INSERT INTO `grados` VALUES (2,'1ro','A',7,'2025-06-26 06:01:49');
/*!40000 ALTER TABLE `grados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('docente','administrativo','obrero') NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('masculino','femenino','otro') NOT NULL,
  `cargo_voucher` varchar(100) NOT NULL,
  `codigo_cargo` varchar(50) DEFAULT NULL,
  `dependencia` varchar(100) NOT NULL,
  `codigo_dependencia` varchar(50) DEFAULT NULL,
  `carga_horaria` varchar(50) DEFAULT NULL,
  `fecha_ingreso_mppe` date NOT NULL,
  `titulos_profesionales` text,
  `tipo_titulo` varchar(15) DEFAULT NULL,
  `talla_franela` varchar(10) DEFAULT NULL,
  `talla_pantalon` varchar(10) DEFAULT NULL,
  `talla_zapato` varchar(10) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal`
--

LOCK TABLES `personal` WRITE;
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
INSERT INTO `personal` VALUES (7,'docente','pepita',NULL,'perez',NULL,'12321432','0247-3418721','ejemplo@ejemplo.com','1999-09-10','femenino','Docente','0002225565','zona educativa','20111888888','45.5','2008-10-15','null','null','s','26','34','2025-06-25 14:54:45','2025-06-27 17:40:40');
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_archivos`
--

DROP TABLE IF EXISTS `personal_archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_archivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `personal_id` int NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `tipo_archivo` enum('imagen','pdf','documento') NOT NULL,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `personal_id` (`personal_id`),
  CONSTRAINT `personal_archivos_ibfk_1` FOREIGN KEY (`personal_id`) REFERENCES `personal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_archivos`
--

LOCK TABLES `personal_archivos` WRITE;
/*!40000 ALTER TABLE `personal_archivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `token_hash` (`token_hash`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (32,2,'$2b$10$fK4Upty/4mCB1lFZBPQmLOP6AruG9a4Kmk7ygOuDsesqvpIsa5hkq','2025-06-21 01:33:21','2025-06-14 05:33:21',1),(33,2,'$2b$10$sH1B7KF/u.2JF2f/JZW8A.gEx42v4x0FcHWax9eIJpflYLsTp7n9a','2025-06-21 01:41:53','2025-06-14 05:41:52',1),(34,2,'$2b$10$8gLrmR88Y/.Zh/WCFBp5W.g1HO7tsnkAeYne6KY8tVgIAY3cOVTOi','2025-06-21 01:42:18','2025-06-14 05:42:17',1),(35,2,'$2b$10$x7/siGsf4m.8iiDlYFw3vukpOIuRwN.T5HbqiD34W5Gtvj1fzgepq','2025-06-21 01:53:56','2025-06-14 05:53:56',1),(36,2,'$2b$10$Rlga4noFR1ec8OPUXFs5DulApAQpCwZ2AwiqCOML43CM8fOFB0Gzu','2025-06-21 01:54:30','2025-06-14 05:54:30',1),(37,2,'$2b$10$OnD2JQMepWTQf9BJa6T4P.siOX9WbMG2ddpsnGQoaYjXoF9teNU1q','2025-06-21 01:54:57','2025-06-14 05:54:56',1),(38,2,'$2b$10$tz.pQhP8HNHip2GyxYhNQ.Y2F2qJiiwa1t/pjTBDt8RYD1rzDRi7K','2025-06-21 01:56:06','2025-06-14 05:56:06',1),(39,2,'$2b$10$Nzn3EfHgLaQ.VC0NdrSNp.sI67eYnB1fe/Rf4b9ba82DNn04WKBDO','2025-06-21 01:56:21','2025-06-14 05:56:20',1),(40,2,'$2b$10$gkPmqCcWvgG60e75vdzsuey5N4jq1uaBunuZEWn2TDCBviRTcahFq','2025-06-21 01:59:17','2025-06-14 05:59:17',1),(41,2,'$2b$10$wWQQ4oia8XlWiwgISQ7rBuQCJYUYGtWIoUSGzv9JzkOGlWOaEQvhO','2025-06-21 01:59:30','2025-06-14 05:59:30',1),(42,2,'$2b$10$nUjNV39L5exGykGfl3dol.bYGa9udaAqY1d24H3xfXubcCkCxP8Zq','2025-06-21 02:01:15','2025-06-14 06:01:15',1),(43,2,'$2b$10$.d0TyVTh2KYC7YYHSg2ANOReVCnd6yBfC732GiDJ5ZjIKqd6X0MCm','2025-06-21 02:02:13','2025-06-14 06:02:12',1),(44,2,'$2b$10$kR/Rd0dQ8RG5BztAw9q9re2SEhda8Q7LG5Y6CJ6HTu2vXD4cJGpy2','2025-06-21 02:04:37','2025-06-14 06:04:36',1),(45,2,'$2b$10$FLs.9JthL9SmHbDiv4CLZOFkL0NNyCPWBKiE3aahrdSautYs15Cx.','2025-06-21 02:45:43','2025-06-14 06:45:43',1),(46,2,'$2b$10$v49lroo2Y5VMLBrCpzIXruBn8C32yWB2g8ZNRGq0emLpqxUr5QEAO','2025-06-21 02:50:25','2025-06-14 06:50:24',1),(47,2,'$2b$10$iR9seh91FONxI4i1JClI3OFdcCWAYkkqVVLHFgNiFrtCWZXtBaYD.','2025-06-21 02:51:02','2025-06-14 06:51:01',1),(48,2,'$2b$10$uPA1XisYVwSw/L.i0GEdguEGBcqgCgBUOL1p/tHWRUZRZwHGJWfNe','2025-06-21 13:45:16','2025-06-14 17:45:15',1),(49,2,'$2b$10$M8uYuMi9SVD4k2wVP0cTzOcyI3GdFq6ZLCACXvWg9lOZEyuAIDRlu','2025-06-21 13:45:17','2025-06-14 17:45:16',1),(50,2,'$2b$10$4092K3oP12i7z5vAi71u2uXNAzba2lUI7v7E1XCDZxQdHoYg/88EK','2025-06-21 13:45:40','2025-06-14 17:45:40',1),(51,2,'$2b$10$r/5RKmYCfRYMvyEpkyZos.GaFdBUkuQpIfYBZyk2vfI1Fdd/GdQwm','2025-06-21 13:46:58','2025-06-14 17:46:58',1),(52,2,'$2b$10$x9K8.qrrOb0aLJEiLAm9OOtO0/vPTq3TyoFyRjFFjSNb5VdjlaE2m','2025-06-21 14:20:21','2025-06-14 18:20:20',1),(53,2,'$2b$10$5kzdxnU5MT6xxpZ5dp6XHOi1DQYexhTJcXXJ9XeT60dKoN4z5A.Wy','2025-06-21 14:20:22','2025-06-14 18:20:22',1),(54,2,'$2b$10$sZI5Y/OR6OFBmaqBROOkeekmP1mRTAAxBzwwrpeeyOa5jYJOWAdry','2025-06-21 14:20:33','2025-06-14 18:20:33',1),(55,2,'$2b$10$UXmrrp9NdLiHY11KePa7wu2uEdsVdAKt27d1dysXCkQlZA7Cx1TwK','2025-06-21 14:20:50','2025-06-14 18:20:49',1),(56,2,'$2b$10$bDdFQR2A8UeqJBJ6DoD/Zeu7G5/.d81QDjLby5eIkRzBeC9I8WSJO','2025-06-22 02:07:06','2025-06-15 06:07:06',1),(57,2,'$2b$10$pMYTFJvSIJAyVJnfXOKgjO.vodtAm5uZk6wFkdreE2NVXwFZ0L5QO','2025-06-22 02:38:18','2025-06-15 06:38:17',1),(58,2,'$2b$10$6NdGgCZbuDsHnTb1J8lLnumYhVtFZCdjwoT9jXLTLhBtsvcwiAD0O','2025-06-22 13:31:37','2025-06-15 17:31:37',1),(59,2,'$2b$10$/j51i0pDg1JrxABGVKiC7OZ6CNYUPLFRsT69LQGx5xV6BxP2Xt8Kq','2025-06-23 00:42:12','2025-06-16 04:42:12',1),(60,2,'$2b$10$NO38SpdOxVbY3oJ6X96NsutTStpuoyctfoAv6.WViN1ItU0hC.RiG','2025-06-23 00:53:13','2025-06-16 04:53:13',1),(61,2,'$2b$10$O81.vvKoD8Zf.qAhYQHp0eiXl6Vf5XVrrigqi/ZmOSodxfx51VZB2','2025-06-23 00:53:36','2025-06-16 04:53:35',1),(62,2,'$2b$10$ALj2opOAx2Sdpb5nusBEO.JmqrzVGbKZmOf61GZ5I9gAVD1gq3B5q','2025-06-23 00:54:58','2025-06-16 04:54:57',1),(63,2,'$2b$10$aZQc.4VhC43FcvhQyvDf7OAs8alQ6qa3L2fHWtUz3AMBX5gBtdqWO','2025-06-23 00:55:19','2025-06-16 04:55:19',1),(64,2,'$2b$10$cD3byrsijzl9xcFskSjbSu0GO9ltrKgA9KAe9N.2mSzOaRGjgPlGG','2025-06-23 00:57:44','2025-06-16 04:57:43',1),(65,2,'$2b$10$KopXWt1crKfICPDoeQ5xhumYwNHHT9bdiAjtMTW1H5HPC2PcPeGIi','2025-06-23 01:01:08','2025-06-16 05:01:07',1),(66,2,'$2b$10$fG5suLb0tO142wP2DeZ7fulMCKzpkDvhczdTTd9VUnWhmsaSGKOKW','2025-06-23 01:01:41','2025-06-16 05:01:40',1),(67,2,'$2b$10$agGP9GpAnXIBmVW.qjaYNO8TVvs9ScDO2NdBlaQBJjyZSZNzKJz7q','2025-06-23 01:02:28','2025-06-16 05:02:28',1),(68,2,'$2b$10$TdY/JbaeukqTkEEvqVv3bOcwP48mY9t.Nj47wLw3.qAVZ3cclMm3i','2025-06-23 01:04:24','2025-06-16 05:04:24',1),(69,2,'$2b$10$HeMw.CYGFDcio2QniA0wOuFZk/DoVc1op3EjofnhYP07/i9b51WXq','2025-06-23 01:05:30','2025-06-16 05:05:30',1),(70,2,'$2b$10$kQs0oZFoK.dVe3JIt7jE6eKcOjlVQKZGNmRA0iH7vtaf01izQTKdq','2025-06-23 01:21:27','2025-06-16 05:21:27',1),(71,2,'$2b$10$vkZDsxq6Dw5D2Snw0aqzBu5.hIId027fv.KKr9DFvr8zZ7hJTInVi','2025-06-23 02:11:49','2025-06-16 06:11:49',1),(72,2,'$2b$10$iBJAU9kdSIOHkgHhY77DOORnSYQesNukfhDm568MdJGrUOUK5bguS','2025-06-23 02:16:27','2025-06-16 06:16:27',1),(73,2,'$2b$10$9vqFAWKi1Efxl6/v5D4XZOg0iVjPcCcKDYa8oIQB3yijmkqVDvNoC','2025-06-23 02:20:19','2025-06-16 06:20:18',1),(74,2,'$2b$10$yF..5wsHNTPCTcnqZEE/iefmeoHEhcAvtS5L240zTg00BAMBpissi','2025-06-23 02:24:23','2025-06-16 06:24:22',1),(75,2,'$2b$10$czE2tQSGcdN5otbzy38u4uOfxnBhAVsUd2PZpuZh7Bk6vQ8ObtlU.','2025-06-23 02:25:47','2025-06-16 06:25:47',1),(76,2,'$2b$10$jG0pdBThj1MwObxTGe2GsOTStVxYvY2cHKMFs0VFECVrGG7wiZosq','2025-06-23 02:27:37','2025-06-16 06:27:37',1),(77,2,'$2b$10$XwAAGQtc8PxeQUd7eA/2C.5LR0zvb3USI2QbeGx9NnAKswzE5Blju','2025-06-23 02:32:29','2025-06-16 06:32:28',1),(78,2,'$2b$10$kFVPBPeM/LfjrcxEFGQNDe3xXRvtv7Hz6mMrcuId0s/nWC9RVdNKe','2025-06-23 02:35:27','2025-06-16 06:35:27',1),(79,2,'$2b$10$NWhabNXjR/Il9jFLI05/g.pthfWn47F/SpwUan3lgwNKYFux6Qm.e','2025-06-23 02:37:56','2025-06-16 06:37:55',1),(80,2,'$2b$10$TgpwVQx8SI0sfw5u9mplLOa10xT3Ufd44fimwlfzqYqhMhnMHFcI.','2025-06-23 02:40:37','2025-06-16 06:40:37',1),(81,2,'$2b$10$j7p42oPQPzw66Eg7qi7AteNpD6JiIm.m0dVzpAiCHhfzFASfc0G1.','2025-06-23 02:42:27','2025-06-16 06:42:27',1),(82,2,'$2b$10$hTq2ccUEdKQCjBaJfhCNQumogv0Z9R1FzWQmlMAqp1T4KLDBdobt6','2025-06-23 02:59:08','2025-06-16 06:59:08',1),(83,2,'$2b$10$yyE2xoNkH7WwFpOnLuGQce8Y2lXrKNf/b1f0Q52bnNNZlk4g7MkMy','2025-06-23 12:25:30','2025-06-16 16:25:29',1),(84,2,'$2b$10$/VBnTJPMbVM3weeps9.p0ux7AJEDV2OcvH0LGVnG/8BHsbxQlyS/C','2025-06-29 02:44:41','2025-06-22 06:44:41',1),(85,2,'$2b$10$8y3.FIWVNbOs47GqWWMDCO0L9Eng/RGd5SiozfDNIL2QaiB71IrIC','2025-06-29 02:59:00','2025-06-22 06:58:59',1),(86,2,'$2b$10$3OdR.L6EDYhlXYFYkL0.8ePOM62KPSIbzhiD2I573Q7mVAI0CSpz.','2025-06-29 03:00:44','2025-06-22 07:00:43',1),(87,2,'$2b$10$LE.rXlyZ3dNyjPdjMMgywefFeqfbXcuYwa7ClEGH5AFqJzUl9CPGq','2025-06-29 03:19:39','2025-06-22 07:19:38',1),(88,2,'$2b$10$9xcXsp1Z9liVpKstcgq2LOZy6i.6nQcv1JH8u9if0a.EaIxcPn.X.','2025-06-29 03:35:04','2025-06-22 07:35:03',1),(89,2,'$2b$10$.m/nnYkOpC0YES9nzTDbrun/y5xMzO/k.POBNWx8tLTmvwM.3e8Qa','2025-06-29 03:51:51','2025-06-22 07:51:50',1),(90,2,'$2b$10$LWBX2hZvmiUJ/5xAMxz6gevs4wQ5mN2r3evsfAfvDjZ7I4hBc7XDm','2025-06-29 04:10:29','2025-06-22 08:10:29',1),(91,2,'$2b$10$2bHtdERdCDhTSebKE9HRwe1AqzCxDNsJwuCfVxWN7zgrAm91KJ9iq','2025-06-29 13:00:11','2025-06-22 17:00:10',1),(92,2,'$2b$10$VvWvab9o1OuSJaHtMK8hbeJEa5yj3i96lEHKq6o.koJhpX2eNW5SS','2025-06-29 13:29:07','2025-06-22 17:29:06',1),(93,2,'$2b$10$tpFUsRk4zY6HmYj2KfiGuOGfvXuURdaWyd1j/LYqOyREUGPgqWG9q','2025-06-29 13:47:41','2025-06-22 17:47:40',1),(94,2,'$2b$10$Qnh9bmNoNnTBe5HdJrovDuMckZOpERpt/sEVrskIUMZxQp.eOyyT2','2025-06-29 14:22:21','2025-06-22 18:22:21',1),(95,2,'$2b$10$m7zJNGv6sbT6qv/uoYJ4l.tiaaEe/2rtgTlrYW7MQ93Ec/rS6eAhS','2025-06-29 14:50:40','2025-06-22 18:50:39',1),(96,2,'$2b$10$blZ/svDjMwJgsHF.hSHTkOXwVQGnG0sdArLDmRv8yikXqSVhjZDiy','2025-06-29 15:33:31','2025-06-22 19:33:31',1),(97,2,'$2b$10$OwEjMlsosUzRG0NsfMol8uXnYmPtmr9DuyV/yIbYTXmy0ZZJESnQW','2025-06-29 15:56:58','2025-06-22 19:56:58',1),(98,2,'$2b$10$3wGVsAGMC/wWsAO00Q0qpe4JrG59IdqPI/NCbYHWciI4FN34DEH2C','2025-06-29 16:58:23','2025-06-22 20:58:23',1),(99,2,'$2b$10$tawSb.tkkZV6p473HyBu4.Tq6t.DcYSqgygXsEX9v/ahqiC0zZ/Be','2025-06-29 18:00:08','2025-06-22 22:00:07',1),(100,2,'$2b$10$G5XbHsgqbB083lIVV5NgkeCLaZAw6sWIjiEXxxPvtDPjng/jdjXUq','2025-06-29 18:17:59','2025-06-22 22:17:59',1),(101,2,'$2b$10$OKOz0XFBlqS042E01b6SkeJzRCXeQp4vY4HVe8cRdz6XFlzO83cBO','2025-06-29 19:08:33','2025-06-22 23:08:32',1),(102,2,'$2b$10$idWnFIyMY2JC6yatCOiZVu1kenA5GpgqHY1bD9iitD1X1z72XiNZe','2025-06-30 00:05:19','2025-06-23 04:05:19',1),(103,2,'$2b$10$LJaIZzJpHGWuEodjbauDiOvicj3SthIB8gqIdij0Qsz5meiXat.Tq','2025-06-30 00:20:48','2025-06-23 04:20:48',1),(104,2,'$2b$10$v6Xb9FMR24TH4gEFC29CjO5rGiv.YdXF8geyIvQdi9By0Jsp.SI8G','2025-06-30 00:36:43','2025-06-23 04:36:42',1),(105,2,'$2b$10$1w3eoYpBYsLkKos/z0Vs9O8WvwZQE3HJvQI27.gFRjFl5bD9Ps4v.','2025-06-30 01:15:03','2025-06-23 05:15:03',1),(106,2,'$2b$10$v1sucAAzJ7/EGnrtRXaN2u2nR9ZDO8HsC05jxENMZPp74mkuxpRP.','2025-06-30 01:48:01','2025-06-23 05:48:00',1),(107,2,'$2b$10$FK0qQfejjtY9BzkT5FXGMeUyCHPiW2rVQUsXQmCVNRzOcUzsf3jaS','2025-06-30 01:48:07','2025-06-23 05:48:07',1),(108,2,'$2b$10$0HHD6R/ytudeYzAmCVkF9O92.Mdr65PZWChouegMl5cg2ELKP3OHW','2025-06-30 01:48:26','2025-06-23 05:48:26',1),(109,2,'$2b$10$CLA0Lv9JT9V7gus9Txpy0uHO.H1Jn5FGqVcmQjq3L2Ml21j8dstK6','2025-06-30 01:58:04','2025-06-23 05:58:03',1),(110,2,'$2b$10$cY4DUhquk.A5PZc8/G1ZUuoCcN8QhG1iN8MQsyFCvd2dg.yxS.ANK','2025-06-30 02:09:50','2025-06-23 06:09:49',1),(111,2,'$2b$10$Jku220kD2e3dhuIeFgG4KeX8/gpm76Hwx1mU/WoA6luWctWxWhQ.i','2025-06-30 02:12:52','2025-06-23 06:12:51',1),(112,2,'$2b$10$Mn..k5iUKm8S6bCzh5xPmu0p3vENLjXEqZAPDMz8w.dZat4TaX3vu','2025-06-30 02:13:39','2025-06-23 06:13:39',1),(113,2,'$2b$10$J0NWT9UjSk/LzWMIL0PIseXz2nDZoiLwgow1iXQwe8SxlCd2NzZbW','2025-06-30 02:27:13','2025-06-23 06:27:13',1),(114,2,'$2b$10$1T1TialUJG8vvAzDtukFE.MSU0pJpmAMuC47C4BToBxdyRbPTVWvi','2025-06-30 02:28:12','2025-06-23 06:28:12',1),(115,2,'$2b$10$wvXvRH.WQ8dQ4CqCptsFWei8sJxXROsTKpCbf6mG6sdtk4PjW9IVO','2025-06-30 02:40:16','2025-06-23 06:40:15',1),(116,2,'$2b$10$WkwyndmcLPYpNba4dRei8eFigLVIOR34RqH7uxCq18j7Rce2ryQ6u','2025-06-30 03:17:34','2025-06-23 07:17:34',1),(117,2,'$2b$10$ZWqgWTclHjmKuoOTkOHvA.Cjw3GicQ5tSaYXiTNq7BzGgPapYnUS.','2025-06-30 03:27:30','2025-06-23 07:27:29',1),(118,2,'$2b$10$XzhU9SvbzN.U2xC1uVpZNeFKODLqExKG7jFiMX2TF.JUD96MlUvIG','2025-06-30 09:01:10','2025-06-23 13:01:10',1),(119,2,'$2b$10$NNdm6k6Lbjl3/D81/9TJBuymHYbSLPMLObvYalEL3kHPj2ujL.NzO','2025-06-30 09:36:55','2025-06-23 13:36:55',1),(120,2,'$2b$10$AE40Xv1hcaJisZ7RBtewXO/5p1Gt/SPadCyMyQbT/DzyuqU13FRzC','2025-06-30 10:26:47','2025-06-23 14:26:47',1),(121,2,'$2b$10$Ee2RZjCB1U5Wj6H.e5xJw.67E5iWGKCVGX/YqLRZ6KeIFyNdgGcw2','2025-06-30 10:52:12','2025-06-23 14:52:11',1),(122,2,'$2b$10$Y9rYas7SdOL4Y0nj4r/fpeHIJrtP06EVkNJJolrd.BRc9/ubbwG2W','2025-06-30 11:31:38','2025-06-23 15:31:38',1),(123,2,'$2b$10$HBF2tN41fh18NYbzB8Fhw.H6NDXVNPpjF/fXpda2Lzb3bgtuTvz.e','2025-06-30 13:49:04','2025-06-23 17:49:04',1),(124,2,'$2b$10$fSiLurzdVkCTihLqPlmxbesBaO4DVA18xftcqH/bWzjMvdxs38jKS','2025-06-30 14:24:54','2025-06-23 18:24:53',1),(125,2,'$2b$10$39i3Msd6CCLWij1gEH9ex.j3jpML9.qefs.mV8lDmdzqvkXWM0xBO','2025-06-30 16:17:23','2025-06-23 20:17:23',1),(126,2,'$2b$10$c8e60mfe5mTbwUAe1Q6hee2TeK9FQgcNAKDXJewdrhVfaL5BFJRwu','2025-06-30 17:27:25','2025-06-23 21:27:24',1),(127,2,'$2b$10$w./xcMJDT9DZUmM7bYuDEudB9TFGgU6nzjcX.rIGWsICa3Se79fEO','2025-06-30 18:13:32','2025-06-23 22:13:32',1),(128,2,'$2b$10$iXfhia/tKnDs4BETcEwjUOj/MAkFsXXt3sTkIPAWPSbHR/URMxY9a','2025-06-30 18:43:38','2025-06-23 22:43:37',1),(129,2,'$2b$10$NpWlhBOdMT4JwidRe/aoNup.Tkckk/Nb3NJKJK4a4IO9kbYvdzZwa','2025-06-30 19:53:02','2025-06-23 23:53:02',1),(130,2,'$2b$10$eXMiEjLR0pwHP.ObYw6i2uwTJjg.my1OmpFaW1Er54DhpGPdWyqay','2025-06-30 21:27:03','2025-06-24 01:27:02',1),(131,2,'$2b$10$FDeaFJgMFtyMSCUo4DeAEeZB0gDGIE4Z8FeYkKSodpNkq9FQL.eDW','2025-06-30 22:24:19','2025-06-24 02:24:19',1),(132,2,'$2b$10$nOuzb2Vynj4lPyz7fz9areFBSDAly6Crrzh3DSLVlk0UtZ3JFTtuG','2025-06-30 22:59:32','2025-06-24 02:59:31',1),(133,2,'$2b$10$BqUvhc9E0j5d9l0/hK1YhuTstcMsb.uV2JUqulMn6DOMJQXtwPcxG','2025-06-30 22:59:49','2025-06-24 02:59:48',1),(134,2,'$2b$10$4UYYmDgDSnzj0bFh..iAR.21jKyXZXZSYAqVge2lKCm28AvqEVmj6','2025-07-01 00:09:24','2025-06-24 04:09:23',1),(135,2,'$2b$10$T6qYOjUxIiLTi4FKhDlUeeJtrNJFyM/KZyLS6RHw34yVmh3cWnbJ2','2025-07-01 01:23:59','2025-06-24 05:23:59',1),(136,2,'$2b$10$JtgTPYjiH.CxbD0Do0VFreaVz3Tpvnv/zIIxZPcKFHRtv9WuNfvey','2025-07-01 01:45:47','2025-06-24 05:45:46',1),(137,2,'$2b$10$KdMlk4MQmSyushk0QOOGGuW0uOlHwcnjx.pyzsoSgO9nwPM28fGza','2025-07-01 02:36:38','2025-06-24 06:36:38',1),(138,2,'$2b$10$vC/DIHRTuTBBxoipJPPAMutFKZ9cbaaaNOH/KzgXiiXld8N.cDFJK','2025-07-01 03:12:35','2025-06-24 07:12:34',1),(139,2,'$2b$10$WNIS6HIB88Myr/907icDbeT0IaKpBoJemyHoUvEkm122MD4RfloKW','2025-07-01 09:54:10','2025-06-24 13:54:10',1),(140,2,'$2b$10$ecoCIxgAjD5qeY/xzVjOIueggGOFzRhGUIkgyZWPnZoGyxaZTefu6','2025-07-01 11:08:14','2025-06-24 15:08:14',1),(141,2,'$2b$10$z3CIPZxt0M9O/8EUc4ocoe7nJyOZptYcw8sM0dlix/fz.CETCTe4a','2025-07-01 11:47:34','2025-06-24 15:47:33',1),(142,2,'$2b$10$17uro7IA4fiP3TIedmstUeCcdBhCgsClSsFt.sbyToYu1iSKFq6OS','2025-07-01 11:55:02','2025-06-24 15:55:02',1),(143,2,'$2b$10$qwgmkUieEznx.NUCqGmqtONGrcS7mltd/hysSuZSEoRWz2cu.yQSC','2025-07-01 12:37:59','2025-06-24 16:37:58',1),(144,2,'$2b$10$nF2q1XP4bs3fMLFfC0Mrb.565788DIxokpiGbd38syRxxeHZYnfm2','2025-07-01 13:04:05','2025-06-24 17:04:04',1),(145,2,'$2b$10$KkMaphYLDDTtLRiwUY9J1usOjZT8YLXGrZ443qfGKQfD8T6KnCWZC','2025-07-01 14:30:35','2025-06-24 18:30:35',1),(146,2,'$2b$10$21wQbkSsE3grGIRQNEpBne2dOnq3POzxrSVuGArM6rUK6vWSO1y6e','2025-07-01 15:17:36','2025-06-24 19:17:36',1),(147,2,'$2b$10$UE4Nxq5wc.8jla6hbvzyf.KqV13xe3rPcHWp5L.DtH..LOdQi1AXy','2025-07-01 15:56:05','2025-06-24 19:56:05',1),(148,2,'$2b$10$qszuo.71CvHGXRjcmdDnmO8p6PKPM.ikacM0uTJsHXVzHv3k2jos2','2025-07-01 16:32:31','2025-06-24 20:32:31',1),(149,2,'$2b$10$DGi8MIHpkjWUI1lCVsGCPuvuGVQA0b/QxzQ4pe.0LL24fDss4dDj2','2025-07-01 16:48:13','2025-06-24 20:48:13',1),(150,2,'$2b$10$hXw5E2a6gDb/dD3raiNh7.BOPMTrHl804MYxnezuv96OPIhLaTau6','2025-07-01 17:26:51','2025-06-24 21:26:50',1),(151,2,'$2b$10$LztJYWRhLxr.5PhZi4cFgu49tz/UHv8qsOt8p6LagJX5JMtNBJbmS','2025-07-01 17:59:14','2025-06-24 21:59:14',1),(152,2,'$2b$10$YZX60bDFK4SZXm8BxzxYfuxAf0Z12luoh/JUGLm1le5j1JXN9ru9i','2025-07-01 18:50:35','2025-06-24 22:50:35',1),(153,2,'$2b$10$Ojxovck/MSH0l5xpkWVKb./X9YeieAY84BB8P1JpZ/wZbt30Nl3yG','2025-07-01 19:28:04','2025-06-24 23:28:04',1),(154,2,'$2b$10$0PhYlc6R5oJ.dxGcE5m07OxrRFHskkw09oAWGaRtxN0a5dEiBl0UC','2025-07-01 22:24:41','2025-06-25 02:24:41',1),(155,2,'$2b$10$h0njmmzdJWwH9TtY.3KEfObwmeU718nS.0KxpuvyhbinoZLMO.hzG','2025-07-01 23:50:42','2025-06-25 03:50:42',1),(156,2,'$2b$10$ro.VdzjLDPupzGaiGJEvp.K5f11HNB4KnzP0P6wZdm9qwbqiTIAoG','2025-07-02 00:36:10','2025-06-25 04:36:09',1),(157,2,'$2b$10$BRJWOz1tuCXCWvjrEq8DCOaNL0wJEMxveoaEcOAt0ifJwd3go9ZJK','2025-07-02 02:55:53','2025-06-25 06:55:52',1),(158,2,'$2b$10$cJSKna.LJuEzn79MaaXTsuMICE86IPTuyk4ah70AGcLf0fOwdVxfK','2025-07-02 03:36:03','2025-06-25 07:36:02',1),(159,2,'$2b$10$T9VyPIRq8tcYXJmvXvSp3OUWVVFx8UTieeGSgwiHoUYvW2ZKfcziW','2025-07-02 04:03:17','2025-06-25 08:03:17',1),(160,2,'$2b$10$ryPJt8DBTG0a/8cmuGRtCu63LB.bD.r1aIsZfdOLB5V.Mkm/RWjuO','2025-07-02 05:02:31','2025-06-25 09:02:30',1),(161,2,'$2b$10$rY304WAUSMS79gqtk8XO5.NRh8d2e1ZyHriTAYo51kIotTdOLVxJG','2025-07-02 05:37:49','2025-06-25 09:37:49',1),(162,2,'$2b$10$ZfSF2Epj8VkB4R4AmYHdkuzVTbeo5dF5frrLmrFWwaIjWQTVJgU4S','2025-07-02 06:14:11','2025-06-25 10:14:11',1),(163,2,'$2b$10$o2N768H.Bkuc1i.prF/5f.KoBBNtaWZ9JGkyyNMlc/1blLciy5thO','2025-07-02 06:55:22','2025-06-25 10:55:21',1),(164,2,'$2b$10$yetK9fMahAtFOahfLBjEserEg169QkgEhNWob7BbWTzJDVoglIEZy','2025-07-02 10:13:18','2025-06-25 14:13:17',1),(165,2,'$2b$10$I0Pmen5ubsjvLimFpKr7PuFWSKzZBCzokvfGlF5ZFUfgf5LZc7a76','2025-07-02 11:02:57','2025-06-25 15:02:56',1),(166,2,'$2b$10$4ABXlsrlWxenZ3zGo3sxEuXMFC6K6e9SiDcA0ghbInAXyovsUuJc6','2025-07-02 11:38:20','2025-06-25 15:38:19',1),(167,2,'$2b$10$GvBnlAW1adCR9RToDXtKe.VQO8ezoZeW/2fqKuyzjpnUoFpI0DmOS','2025-07-02 12:31:31','2025-06-25 16:31:30',1),(168,2,'$2b$10$/MbBmggLJS3Tm.UViWJXveBJzPmm87INiPh2muQ3n4ylyG08UVyjq','2025-07-02 13:09:21','2025-06-25 17:09:21',1),(169,2,'$2b$10$AyPiTjJKgFK4MbKhOaQ9IezYh7t/kt0lVKToYhW.uAa7ysRO3/QQG','2025-07-02 14:15:12','2025-06-25 18:15:12',1),(170,2,'$2b$10$VOx2URUR1u31zQyf5hoqZ.1apABzVviqEDb3IxIKyrgPay4gPy99K','2025-07-02 15:05:04','2025-06-25 19:05:04',1),(171,2,'$2b$10$jIrp6jXlS/zMu2HmNVkg1e6HPnRDO5o8SVQBoNhzidQUIRfQ7sVl.','2025-07-02 15:41:33','2025-06-25 19:41:32',1),(172,2,'$2b$10$5.U.c8nMgf2WnplMg5fTY.omk.kl8hqncX4PTiWWuhf4Yq.FEnhvi','2025-07-02 16:16:55','2025-06-25 20:16:55',1),(173,2,'$2b$10$mAtoyqsv4qcbDIjf5KYySeJoY8jDKGu88WDZMaKVcteZPi/t4mNau','2025-07-02 16:52:23','2025-06-25 20:52:22',1),(174,2,'$2b$10$Bvzj4gDzlDdmbrrA.FDxkebgcTdqXWJOoa5tV8eUj694FpNtOhXdS','2025-07-02 17:30:25','2025-06-25 21:30:25',1),(175,2,'$2b$10$0tbI9EUqWAVh4CtXr/h9xu8Z9SRISOjlu395sLYJ8YKQjQBHoCOuC','2025-07-02 17:44:43','2025-06-25 21:44:43',1),(176,2,'$2b$10$YajyqBAPCNfsHdBTA3MVt.xYmCRIAl7IEV5UIaoU9l.yFFzutTSuS','2025-07-02 18:23:43','2025-06-25 22:23:43',1),(177,2,'$2b$10$4fo.8LzGR84rRdpCpIai.uqdsMvU7Gx4kPfL2yVlaIgobScnPdoJq','2025-07-02 19:26:37','2025-06-25 23:26:37',1),(178,2,'$2b$10$x3ir6JuoEhzIX7xbYr6Hbu13fwdwh9/Tdqs/IMM.2RsaRvS/aABaq','2025-07-02 22:04:49','2025-06-26 02:04:48',1),(179,2,'$2b$10$0bjj.vSnxfBaiLZYFCIL3.VdTZgRqUNvJAPfkUNP9F9wvNxj76cHG','2025-07-02 22:49:30','2025-06-26 02:49:29',1),(180,2,'$2b$10$AdJDXCerk.nTBiqrIG8W0OXsq3B2ydf9/996Dj1ydsdNyH7MlneOG','2025-07-02 22:51:19','2025-06-26 02:51:18',1),(181,2,'$2b$10$FKXa5.o750Vtl89JFEqTDeZQxiSuaJlAjYpv584Kv.95vv.rraTXW','2025-07-02 23:33:14','2025-06-26 03:33:14',1),(182,2,'$2b$10$9Z4P2SKm7ao.a2K5Qerys.Wr2YFyCeV6yMon2gDeaB3/BxtVaxGCS','2025-07-03 01:05:59','2025-06-26 05:05:58',1),(183,2,'$2b$10$ZDSJsOhUlS0of/XK0ffj9urJlvZjwf5xDC5Dl.TePpEPLY8OUp7p2','2025-07-03 01:42:43','2025-06-26 05:42:43',1),(184,2,'$2b$10$YrHXxwOtIBG8APrhrIihxeJj.kGLSVEfoQjehC/WRlMwFwiX.j6o6','2025-07-03 02:28:15','2025-06-26 06:28:15',1),(185,2,'$2b$10$s/iQ1EXLpEZkrBcjxOGIHurJGvoi5wq9UamAzVTTI7tNv9iGvZHca','2025-07-03 09:37:13','2025-06-26 13:37:13',1),(186,2,'$2b$10$iTvkeAwyND1Q4sTGIKz2AO8.f.AHgq/iqzBcy.v4iHVtJFCKvRgsm','2025-07-03 10:26:32','2025-06-26 14:26:31',1),(187,2,'$2b$10$/SCSFfbJuve3evSZxi5HdOnRNtaXNEAIIqcZrDLyhwYpdSm8blCrO','2025-07-03 11:06:34','2025-06-26 15:06:34',1),(188,2,'$2b$10$tl7ZxXpiwSzsrWgIpvdAV.5/3AKAVqfdue4obsFqmWJu61wjPn8lC','2025-07-03 12:13:13','2025-06-26 16:13:13',1),(189,2,'$2b$10$OV4sGRvj0OAJtsmLG7q3ou5yfN3hQIzr4tJd9nDCAEaAaxncQQIXO','2025-07-03 12:29:06','2025-06-26 16:29:06',1),(190,2,'$2b$10$6FhGZ7oPt4cXgjYSDHf6euISa9gSSy8GTB0Tv9bOCiLPdmQXkd8lK','2025-07-03 15:14:47','2025-06-26 19:14:46',1),(191,2,'$2b$10$Wdq5NL4kaUK84DfkCkcXTuU2.6VoDred0Fcq0xa9mgPGX2NPNeAnm','2025-07-03 15:18:25','2025-06-26 19:18:25',1),(192,2,'$2b$10$yaTbk3qqrhT1B04TFMgGle3opIxAs0Q0GyMCHPE.MCq13LV/8jy9a','2025-07-03 15:21:30','2025-06-26 19:21:30',1),(193,2,'$2b$10$IymzPaXRKI1jxJ7JCODZKumwbi3jSuAg7RE1/ASdcOVXrArOcSS8.','2025-07-03 15:56:48','2025-06-26 19:56:48',1),(194,2,'$2b$10$naS6NiAeW4MJ41mIVaFeiukLXlhj1Om8AA6dfTTg9e4nAJ1VaEQZi','2025-07-03 16:14:56','2025-06-26 20:14:55',1),(195,2,'$2b$10$CcoUTTTib5kfeo0ustF3uu2lo0XzRbh4A1XCwPnQtU3xjWw.ZfYPW','2025-07-03 16:29:08','2025-06-26 20:29:07',1),(196,2,'$2b$10$zBaW6FtzSjmWl.iKoGvg5.83fvMyQq6xWZobVaF8rfLnmmF0wBHru','2025-07-03 16:36:01','2025-06-26 20:36:00',1),(197,2,'$2b$10$6ogCt.sZWW.QHJ7oGf5AjevxkJtkIzosE3fE23/YXRtDyH0bVTxaO','2025-07-03 16:36:50','2025-06-26 20:36:49',1),(198,2,'$2b$10$Ik8C75lvDkzdnK6m0XWL0eW7a.OAK/3Tz4y2fq2ojbFrtNtuRUq8q','2025-07-03 16:38:42','2025-06-26 20:38:41',1),(199,2,'$2b$10$ghrSmYOiQAE6kUjTVtNfLehOy1TS3SCrMSPmKUnejTiKntBYZP7Da','2025-07-03 16:42:30','2025-06-26 20:42:30',1),(200,2,'$2b$10$SoQ7xU7gZ0q/fJS76h30Xei8oF8M28b0YjIx1l0JEuMqKdDK9M5d6','2025-07-03 16:43:34','2025-06-26 20:43:33',1),(201,2,'$2b$10$fsE4mtYLr2VMUzbXGR2f2eeCl8ODXgafueY4QDDBTLFy4iXUkFHdS','2025-07-03 16:44:30','2025-06-26 20:44:30',1),(202,2,'$2b$10$iWYfTeIPQZYvvsKrrRSmcu2trsccFgtZD66jvP8UO0bBYDwJwqiLy','2025-07-03 16:46:53','2025-06-26 20:46:52',1),(203,2,'$2b$10$47JSrCG/yCu/2tn4bnSW0.fvjXFeGs5ZqJ3YMRj6NgzVNB94xhJAO','2025-07-03 16:47:18','2025-06-26 20:47:17',1),(204,2,'$2b$10$Fn1/WC1wySx2p45FKdbbAOzgSgeAKaQuSK4W2LU/XLoTPJrtD.W4a','2025-07-03 16:48:36','2025-06-26 20:48:36',1),(205,2,'$2b$10$JMr0yVq1MYHy0zsNjmDnvOWHQvwb7r.lNYBeeZUIyjSHfVFzzbSD.','2025-07-03 16:49:42','2025-06-26 20:49:41',1),(206,2,'$2b$10$H0fBJ8.FDiMDha2bPLtwWumQ3wKKBgr6zYHg13dJJcV.FtXQ4wFue','2025-07-03 16:52:00','2025-06-26 20:52:00',1),(207,2,'$2b$10$ZVbjoVWxVK3QRWykNKQQRu9CkGu2O0rHH/XbcootZ5V2u.r5Zp2B6','2025-07-03 17:04:33','2025-06-26 21:04:32',1),(208,2,'$2b$10$g31zujfzYlPCkzqWJZKmSesZZ7a/cEe9t3QqFTEe3Iy.Ct5.aDkTm','2025-07-03 17:04:56','2025-06-26 21:04:56',1),(209,2,'$2b$10$uuzJh2hhU832eXt/rNisJ.sFzPN7MqNF8TI9MXn1/kA6/W.D2FnZO','2025-07-03 17:06:02','2025-06-26 21:06:01',1),(210,2,'$2b$10$2iBtiNCU3LaFqifJI1gtUeebxcnBVqzLTbK6oAezn45fXfSq8SixW','2025-07-03 17:09:45','2025-06-26 21:09:44',1),(211,2,'$2b$10$WhsEel5BNyj02ZaakFIbS.Tvm9K3fRQeXo9Q095.Aur69xKaE3vM6','2025-07-03 17:11:11','2025-06-26 21:11:11',1),(213,2,'$2b$10$axq.331BjFe5ABh306vS9.jviN9DY9TnDWoi1lBTajKGzJPorBec.','2025-07-03 18:16:02','2025-06-26 22:16:01',1),(214,2,'$2b$10$DlJOCgjsG47sxp9aURjwZ.wFy4Q7w3tA9gBSXGXXDlDpg7k3/tcOa','2025-07-03 19:17:52','2025-06-26 23:17:51',1),(216,2,'$2b$10$p0ShIWE.SL/EvhRawjaBhOmeM7fVbv2J.O/CphDWc.4Pwmcp4tpbe','2025-07-03 22:06:21','2025-06-27 02:06:20',1),(217,2,'$2b$10$HbqfDk3.hq1Kf4Tg5Rgv5Ou0XCaNtwovFseb2LvGhQP2R/d.t6XN6','2025-07-03 23:53:29','2025-06-27 03:53:29',1),(218,2,'$2b$10$rnXC/HiUr0QmjmxIkzX88ePxbMc4StjuVLZ3N0D5D0G/OPNyiMrFu','2025-07-04 00:13:06','2025-06-27 04:13:05',1),(219,2,'$2b$10$.1fXaWHdGFRho7Xf9qR3q.7S7BFulT9Udf8cUlc1c4ySE3lZq6Cdi','2025-07-04 00:20:27','2025-06-27 04:20:27',1),(220,2,'$2b$10$5UYBs2LcOxx1AxEsAqbKiOk7Ov5X14z8cY2qe74O7hfFvfdD/ROoq','2025-07-04 00:22:05','2025-06-27 04:22:04',1),(221,2,'$2b$10$8at4Ecw2KGAvNfS/n9lHXeIZ25LA1irAuxFFtqcZ6IZLW4BJz.e6O','2025-07-04 00:23:19','2025-06-27 04:23:18',1),(222,2,'$2b$10$mIkpwom44DoTWGZayYpNlefiFyZX5EszUNnJm5o8GiViumyHO/LiC','2025-07-04 01:28:36','2025-06-27 05:28:36',1),(223,2,'$2b$10$m2.H7Z5QJVHBOTaBef7CheCKw5qi.iKW2SnU8Ij76xKCU4tZQtukm','2025-07-04 02:29:29','2025-06-27 06:29:28',1),(224,2,'$2b$10$TIKJu9OZN.o7VpdEmFLx0OmjIPjaBJWWaE8BGy0sMJ4rpLV6S3OC6','2025-07-04 08:39:36','2025-06-27 12:39:36',1),(225,2,'$2b$10$ALa/lrUL.k5dDX7U75KetOF5QWi/faSC8NtT1PlVVE21B9BYMn/.6','2025-07-04 13:38:43','2025-06-27 17:38:43',1),(226,2,'$2b$10$zABxsfkQ2HCH7Hh2G3xbLO6g5YptAMtZ7arZ3msTT.bBjTyKgo7Fi','2025-07-04 13:43:41','2025-06-27 17:43:40',0);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `representantes`
--

DROP TABLE IF EXISTS `representantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `representantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `relacion` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) NOT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `tipo_cedula` varchar(20) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula_UNIQUE` (`cedula`),
  KEY `idx_representantes_cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `representantes`
--

LOCK TABLES `representantes` WRITE;
/*!40000 ALTER TABLE `representantes` DISABLE KEYS */;
INSERT INTO `representantes` VALUES (9,'jugnfgh','veraras','Padre','liancarlos2323@gmail.com','02473411497','ministro','Venezolana','30493727','2025-06-23 19:51:38'),(66,'jugnfgh','veraras','Madre','admin@solutionswebjm.com','02473411497','ministro','Venezolana','18727619','2025-06-23 23:02:37'),(68,'pepito','josefino','Padre','jasidiasid@jasjd.com','042545285','nosebro','Venezolana','254658228','2025-06-25 17:18:02'),(69,'asdasdasd','asdasdasd','Madre','asdas1231@gameilc.om','615654546151325','asdasd','Venezolana','123213123123','2025-06-26 20:06:27');
/*!40000 ALTER TABLE `representantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('administrador','usuario') NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,'Admin','admin','admin@gmail.com','$2b$10$qF5elrlEI7oq6LTCni/NwOR6KlHTTVLvZHE/EmiNYgiTL/F7WgFA6','administrador');
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

-- Dump completed on 2025-06-27 14:39:44
