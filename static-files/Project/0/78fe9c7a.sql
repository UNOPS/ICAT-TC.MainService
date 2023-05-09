-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: authdb
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Table structure for table `login_profile`
--

DROP TABLE IF EXISTS `login_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_profile` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` varchar(36) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `profileState` int NOT NULL DEFAULT '0',
  `otp` int NOT NULL DEFAULT '0',
  `otpExpireAt` datetime DEFAULT NULL,
  `coutryId` int DEFAULT NULL,
  `insId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cb678b788b31d3a279c55295fc` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_profile`
--

LOCK TABLES `login_profile` WRITE;
/*!40000 ALTER TABLE `login_profile` DISABLE KEYS */;
INSERT INTO `login_profile` VALUES ('-','2023-02-16 09:52:26','-','2023-02-16 09:52:26',0,'c0197f79-5351-410b-b21e-1d45478591e2','de@gmail.com','$2b$10$BgaNqyLJpFNTzjrGWwJmD.z052U/Ge1AcYI.9hG77F92jUnm4vZ7e','$2b$10$BgaNqyLJpFNTzjrGWwJmD.',0,0,NULL,1,1),('-','2023-02-16 09:52:26','-','2023-02-16 09:52:26',0,'c0197f79-5351-410b-b21e-1d45478591e3','admin@gmail.com','$2b$10$BgaNqyLJpFNTzjrGWwJmD.z052U/Ge1AcYI.9hG77F92jUnm4vZ7e','$2b$10$BgaNqyLJpFNTzjrGWwJmD.',0,0,NULL,1,1);
/*!40000 ALTER TABLE `login_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_profile_user_type_user_type`
--

DROP TABLE IF EXISTS `login_profile_user_type_user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_profile_user_type_user_type` (
  `loginProfileId` varchar(36) NOT NULL,
  `userTypeId` int NOT NULL,
  PRIMARY KEY (`loginProfileId`,`userTypeId`),
  KEY `IDX_45be7140ae5ec7fab70715dd33` (`loginProfileId`),
  KEY `IDX_c29dbcd080461741acc8555856` (`userTypeId`),
  CONSTRAINT `FK_45be7140ae5ec7fab70715dd331` FOREIGN KEY (`loginProfileId`) REFERENCES `login_profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_c29dbcd080461741acc8555856d` FOREIGN KEY (`userTypeId`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_profile_user_type_user_type`
--

LOCK TABLES `login_profile_user_type_user_type` WRITE;
/*!40000 ALTER TABLE `login_profile_user_type_user_type` DISABLE KEYS */;
INSERT INTO `login_profile_user_type_user_type` VALUES ('c0197f79-5351-410b-b21e-1d45478591e3',1);
/*!40000 ALTER TABLE `login_profile_user_type_user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` enum('Master_Admin','Country Admin','Verifier','Sector Admin','MRV Admin','Technical Team','Data Collection Team','QC Team','Institution Admin','Data Entry Operator') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (NULL,NULL,NULL,NULL,0,1,'MASTER_ADMIN','Master_Admin'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,2,'Country Admin','Country Admin'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,3,'Verifier','Verifier'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,4,'Sector Admin','Sector Admin'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,5,'MRV Admin','MRV Admin'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,6,'Technical Team','Technical Team'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,7,'Data Entry Operator','Data Entry Operator'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,8,'QC Team','QC Team'),('-','2023-02-16 11:49:48','-','2023-02-16 11:49:48',0,9,'Institution Admin','Institution Admin');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-03 12:24:16
