-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: volunteer_db
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branches`
--

DROP TABLE IF EXISTS `Branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `organization_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `Branches_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branches`
--

LOCK TABLES `Branches` WRITE;
/*!40000 ALTER TABLE `Branches` DISABLE KEYS */;
INSERT INTO `Branches` VALUES (1,'Adelaide',1),(2,'Auckland',1);
/*!40000 ALTER TABLE `Branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmailNotifications`
--

DROP TABLE IF EXISTS `EmailNotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmailNotifications` (
  `user_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `notification_type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`organization_id`,`notification_type`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `EmailNotifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `EmailNotifications_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmailNotifications`
--

LOCK TABLES `EmailNotifications` WRITE;
/*!40000 ALTER TABLE `EmailNotifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmailNotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `organization_id` int NOT NULL,
  `date` timestamp NOT NULL,
  `attendees` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `branch_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `fk_branch` (`branch_id`),
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_branch` FOREIGN KEY (`branch_id`) REFERENCES `Branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (1,'Cube','Adelaide','Once upon a time there was the cube',0,0,1,'2024-06-29 13:20:00',0,'2024-06-04 03:50:37','2024-06-04 03:50:37',1);
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Managers`
--

DROP TABLE IF EXISTS `Managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Managers` (
  `user_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`organization_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `Managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Managers_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Managers`
--

LOCK TABLES `Managers` WRITE;
/*!40000 ALTER TABLE `Managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrganisationManagers`
--

DROP TABLE IF EXISTS `OrganisationManagers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrganisationManagers` (
  `organization_id` int NOT NULL,
  `manager_id` int NOT NULL,
  PRIMARY KEY (`organization_id`,`manager_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `OrganisationManagers_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `OrganisationManagers_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrganisationManagers`
--

LOCK TABLES `OrganisationManagers` WRITE;
/*!40000 ALTER TABLE `OrganisationManagers` DISABLE KEYS */;
INSERT INTO `OrganisationManagers` VALUES (2,1),(1,8);
/*!40000 ALTER TABLE `OrganisationManagers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RSVP`
--

DROP TABLE IF EXISTS `RSVP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RSVP` (
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `RSVP_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `RSVP_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSVP`
--

LOCK TABLES `RSVP` WRITE;
/*!40000 ALTER TABLE `RSVP` DISABLE KEYS */;
INSERT INTO `RSVP` VALUES (8,1,'2024-06-04 12:46:15','2024-06-04 12:46:15');
/*!40000 ALTER TABLE `RSVP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Updates`
--

DROP TABLE IF EXISTS `Updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Updates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_private` tinyint(1) DEFAULT '0',
  `organization_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `Updates_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Updates`
--

LOCK TABLES `Updates` WRITE;
/*!40000 ALTER TABLE `Updates` DISABLE KEYS */;
INSERT INTO `Updates` VALUES (1,'2024-06-04 13:26:38','We','almost done',1,1,'2024-06-04 13:26:38','2024-06-04 13:26:38'),(2,'2024-06-04 13:26:45','We not','almost done',0,1,'2024-06-04 13:26:44','2024-06-04 13:26:44');
/*!40000 ALTER TABLE `Updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserBranches`
--

DROP TABLE IF EXISTS `UserBranches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserBranches` (
  `user_id` int NOT NULL,
  `branch_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `UserBranches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `UserBranches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `Branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserBranches`
--

LOCK TABLES `UserBranches` WRITE;
/*!40000 ALTER TABLE `UserBranches` DISABLE KEYS */;
INSERT INTO `UserBranches` VALUES (8,1);
/*!40000 ALTER TABLE `UserBranches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserOrganizations`
--

DROP TABLE IF EXISTS `UserOrganizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserOrganizations` (
  `user_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`organization_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `UserOrganizations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `UserOrganizations_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserOrganizations`
--

LOCK TABLES `UserOrganizations` WRITE;
/*!40000 ALTER TABLE `UserOrganizations` DISABLE KEYS */;
INSERT INTO `UserOrganizations` VALUES (4,3,'2024-06-04 08:40:49','2024-06-04 08:40:49'),(8,1,'2024-06-04 08:47:34','2024-06-04 08:47:34'),(8,2,'2024-06-04 09:08:47','2024-06-04 09:08:47');
/*!40000 ALTER TABLE `UserOrganizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `social_media_linked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `Users_chk_1` CHECK ((`role` in (_utf8mb4'Regular',_utf8mb4'Manager',_utf8mb4'Admin')))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Gautam','Das','gautam.das.cse@gmail.com','$2b$10$KL0tWjLOP5mfI9oYRaNnmOjxK0vNdTaYsLfSVc1k2qrFs50LQZrxa','Manager',0,'2024-06-03 04:46:43','2024-06-04 04:50:14'),(3,'Gautam','Das','gautam.das.cse@.com','$2b$10$ac86neGSViyoLPtXqhgXeOamWr2u2.7EoJn.MS1uYTWbA.Wn7.oWi','admin',0,'2024-06-03 04:48:52','2024-06-03 04:48:52'),(4,'Gautam','Das','gautam.das.cse@g.com','$2b$10$5XcgMXWI/tORX4ilIkUJF.tq482tOlii8RxdQB/CQcY2wkmfp/o1q','Admin',0,'2024-06-03 04:50:33','2024-06-03 04:50:33'),(5,'Gono','Teer','gono@mail.com','$2b$10$aAmt2ElYlZ7lh1fl22hrQuVc4WsirxhLHsvQz9I.ZVqmyU0gz7Jjm','Regular',0,'2024-06-03 05:19:55','2024-06-03 05:19:55'),(6,'Gautam','Das','gdas2005gdas@gmail.com',NULL,'Regular',1,'2024-06-03 07:34:21','2024-06-03 07:34:21'),(7,'GautamDasUNIAD','','a1870669@student.adelaide.edu.au',NULL,'Regular',1,'2024-06-03 07:50:07','2024-06-03 07:50:07'),(8,'Manager','Man','manager@g.com','$2b$10$lvpAXAGqpg92eP0LZDZZv.Py9qcB47iKFSF3kGTpRBZ934TBb7xBi','Manager',0,'2024-06-04 01:28:25','2024-06-04 01:28:25');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VolunteerOrganizations`
--

DROP TABLE IF EXISTS `VolunteerOrganizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VolunteerOrganizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `social_media_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VolunteerOrganizations`
--

LOCK TABLES `VolunteerOrganizations` WRITE;
/*!40000 ALTER TABLE `VolunteerOrganizations` DISABLE KEYS */;
INSERT INTO `VolunteerOrganizations` VALUES (1,'VDC','Volunteering goes brrr','https://www.youtube.com/watch?v=dQw4w9WgXcQ','2024-06-03 09:12:39','2024-06-03 09:12:39'),(2,'VDC2','Volunteering goes brrr','https://www.youtube.com/watch?v=dQw4w9WgXcQ','2024-06-03 09:13:11','2024-06-03 09:13:11'),(3,'vdc','sdfsfsfsf','sfsfsf','2024-06-03 09:25:59','2024-06-03 09:25:59');
/*!40000 ALTER TABLE `VolunteerOrganizations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-04 14:10:49
