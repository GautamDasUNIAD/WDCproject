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
  `description` text,
  `x` float DEFAULT NULL,
  `y` float DEFAULT NULL,
  `organization_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `Branches_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branches`
--

LOCK TABLES `Branches` WRITE;
/*!40000 ALTER TABLE `Branches` DISABLE KEYS */;
INSERT INTO `Branches` VALUES (1,'Adelaide',NULL,NULL,NULL,1),(2,'Auckland',NULL,NULL,NULL,1),(3,'hllo',NULL,NULL,NULL,1),(4,'New York','New York Branch Description',40.7128,-74.006,4),(5,'San Francisco','San Francisco Branch Description',37.7749,-122.419,4),(6,'Chicago','Chicago Branch Description',41.8781,-87.6298,5);
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
INSERT INTO `EmailNotifications` VALUES (11,4,'updates','2024-06-14 03:56:47','2024-06-14 03:56:47'),(12,5,'events','2024-06-14 03:56:47','2024-06-14 03:56:47');
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
  `upvote` int DEFAULT '0',
  `downvote` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `organization_id` (`organization_id`),
  KEY `fk_branch` (`branch_id`),
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `VolunteerOrganizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_branch` FOREIGN KEY (`branch_id`) REFERENCES `Branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (1,'Cube','Adelaide','Once upon a time there was the cube',1,'2024-06-29 13:20:00',0,'2024-06-04 03:50:37','2024-06-10 14:23:34',1,3,1),(2,'test','test','test',1,'2024-06-05 02:02:00',0,'2024-06-07 16:32:18','2024-06-10 14:24:36',1,2,0),(3,'sd','sd','1',1,'2024-06-06 02:13:00',0,'2024-06-07 16:43:48','2024-06-10 14:23:45',1,1,0),(4,'sd','sd','1',1,'2024-06-06 02:13:00',0,'2024-06-07 16:44:16','2024-06-10 14:23:47',1,-1,0),(5,'adad','ada','1',1,'2024-06-06 02:17:00',0,'2024-06-07 16:47:41','2024-06-07 16:47:41',1,0,0),(6,'1','1','1',1,'2024-06-03 02:19:00',0,'2024-06-07 16:49:47','2024-06-13 14:39:23',1,52,17),(7,'xcxc','xcx','1',1,'2024-06-05 13:44:00',0,'2024-06-08 04:14:37','2024-06-10 14:23:03',1,1,0),(8,'s','ss','h',1,'2024-06-05 13:48:00',0,'2024-06-08 04:18:33','2024-06-08 04:18:33',1,0,0),(9,'g','g','1',1,'2024-06-12 13:50:00',0,'2024-06-08 04:20:29','2024-06-08 04:20:29',1,0,0),(10,'1','1','1',1,'2024-06-05 13:52:00',0,'2024-06-08 04:22:50','2024-06-08 04:22:50',1,0,0),(11,'1','1','1',1,'2024-06-04 14:01:00',0,'2024-06-08 04:31:08','2024-06-10 14:22:40',1,-1,0),(12,'1','1','1',1,'2024-06-04 14:01:00',0,'2024-06-08 04:31:50','2024-06-10 14:22:43',1,1,0),(13,'1','1','1',1,'2024-06-03 14:12:00',0,'2024-06-08 04:42:15','2024-06-10 14:18:43',1,2,1),(14,'1','1','1',1,'2024-06-05 14:16:00',0,'2024-06-08 04:46:30','2024-06-08 04:46:30',1,0,0),(15,'1','1','1',1,'2024-06-04 14:29:00',0,'2024-06-08 05:00:01','2024-06-08 05:00:01',1,0,0),(16,'1','1','test',1,'2024-06-06 17:19:00',0,'2024-06-08 07:49:22','2024-06-08 07:49:22',1,0,0),(17,'testing','1','1',1,'2024-06-06 17:22:00',0,'2024-06-08 07:52:08','2024-06-08 07:52:08',1,0,0),(18,'1','1','1',1,'2024-06-06 17:31:00',0,'2024-06-08 08:01:13','2024-06-08 08:01:13',1,0,0),(19,'1','1','1',1,'2024-06-20 17:31:00',0,'2024-06-08 08:01:33','2024-06-08 08:01:33',1,0,0),(20,'1','1','1',1,'2024-06-20 17:37:00',0,'2024-06-08 08:07:27','2024-06-08 08:07:27',1,0,0),(21,'testte','1','te',1,'2024-06-14 17:43:00',0,'2024-06-08 08:13:37','2024-06-08 08:13:37',1,0,0),(22,'1','1','1',1,'2024-06-19 18:30:00',0,'2024-06-08 09:00:53','2024-06-08 09:00:53',1,1,1),(23,'Community Clean-Up','Central Park','Join us for a community clean-up event at Central Park',4,'2024-07-10 10:00:00',10,'2024-06-14 03:56:46','2024-06-14 03:56:46',4,5,1),(24,'Tree Planting','Golden Gate Park','Help us plant trees in Golden Gate Park',5,'2024-08-15 09:00:00',20,'2024-06-14 03:56:46','2024-06-14 03:56:46',5,10,2);
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
INSERT INTO `Managers` VALUES (12,4,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(13,5,'2024-06-14 03:56:46','2024-06-14 03:56:46');
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
INSERT INTO `OrganisationManagers` VALUES (2,1),(1,8),(4,8),(4,11),(4,12),(5,13);
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
INSERT INTO `RSVP` VALUES (8,1,'2024-06-04 12:46:15','2024-06-04 12:46:15'),(11,23,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(12,24,'2024-06-14 03:56:46','2024-06-14 03:56:46');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Updates`
--

LOCK TABLES `Updates` WRITE;
/*!40000 ALTER TABLE `Updates` DISABLE KEYS */;
INSERT INTO `Updates` VALUES (1,'2024-06-04 13:26:38','We','almost done',1,1,'2024-06-04 13:26:38','2024-06-04 13:26:38'),(2,'2024-06-04 13:26:45','We not','almost done',0,1,'2024-06-04 13:26:44','2024-06-04 13:26:44'),(3,'2024-06-08 04:09:45','c','c',0,1,'2024-06-08 04:09:44','2024-06-08 04:09:44'),(4,'2024-06-08 10:20:42','New update','wooo',0,1,'2024-06-08 10:20:41','2024-06-08 10:20:41'),(5,'2024-06-08 10:31:51','1','1',0,1,'2024-06-08 10:31:50','2024-06-08 10:31:50'),(6,'2024-06-08 10:47:13','1','1',0,1,'2024-06-08 10:47:13','2024-06-08 10:47:13'),(7,'2024-06-10 09:03:33','hell','test',0,1,'2024-06-10 09:03:32','2024-06-10 09:03:32'),(8,'2024-06-14 03:56:46','Monthly Meeting','Monthly meeting for all members',0,4,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(9,'2024-06-14 03:56:46','Volunteer Appreciation','Event to appreciate all volunteers',1,5,'2024-06-14 03:56:46','2024-06-14 03:56:46');
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
INSERT INTO `UserBranches` VALUES (8,1),(8,2),(11,4),(12,5),(13,6);
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
INSERT INTO `UserOrganizations` VALUES (4,3,'2024-06-04 08:40:49','2024-06-04 08:40:49'),(8,1,'2024-06-04 08:47:34','2024-06-04 08:47:34'),(8,2,'2024-06-04 09:08:47','2024-06-04 09:08:47'),(11,4,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(12,4,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(13,5,'2024-06-14 03:56:46','2024-06-14 03:56:46');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Gautam','Das','gautam.das.cse@gmail.com','$2b$10$KL0tWjLOP5mfI9oYRaNnmOjxK0vNdTaYsLfSVc1k2qrFs50LQZrxa','Manager',0,'2024-06-03 04:46:43','2024-06-04 04:50:14'),(3,'Gautam','Das','gautam.das.cse@.com','$2b$10$ac86neGSViyoLPtXqhgXeOamWr2u2.7EoJn.MS1uYTWbA.Wn7.oWi','Admin',0,'2024-06-03 04:48:52','2024-06-13 15:43:41'),(4,'Gautam','Das','gautam.das.cse@g.com','$2b$10$5XcgMXWI/tORX4ilIkUJF.tq482tOlii8RxdQB/CQcY2wkmfp/o1q','Admin',0,'2024-06-03 04:50:33','2024-06-03 04:50:33'),(5,'Gono','Teer','gono@mail.com','$2b$10$aAmt2ElYlZ7lh1fl22hrQuVc4WsirxhLHsvQz9I.ZVqmyU0gz7Jjm','Regular',0,'2024-06-03 05:19:55','2024-06-03 05:19:55'),(6,'Gautam','Das','gdas2005gdas@gmail.com',NULL,'Regular',1,'2024-06-03 07:34:21','2024-06-03 07:34:21'),(7,'GautamDasUNIAD','','a1870669@student.adelaide.edu.au',NULL,'Regular',1,'2024-06-03 07:50:07','2024-06-03 07:50:07'),(8,'Manager','Man','manager@g.com','$2b$10$lvpAXAGqpg92eP0LZDZZv.Py9qcB47iKFSF3kGTpRBZ934TBb7xBi','Manager',0,'2024-06-04 01:28:25','2024-06-04 01:28:25'),(9,'test','test','test@g.com','$2b$10$6hstETwlJL4amPHbtWkmCu3SFNCwChwUb4df4Uv41SRGNrFiXz6BW','Regular',0,'2024-06-05 16:12:20','2024-06-05 16:12:20'),(10,'testuser','testuser','testuser','$2b$10$nbuJF2OqobWdfFaDU6vPru83tEvZZ0R9bdFrMm1kItCQfTr0xM6nS','Regular',0,'2024-06-10 09:33:30','2024-06-10 09:33:30'),(11,'Alice','Smith','alice.smith@example.com','$2b$10$J8HdVQZlM8JQ8U4zuvKqOu8yJeM2BwYe7adq3ZBf0F3HC1hbEwVhC','Manager',0,'2024-06-14 03:56:46','2024-06-14 04:51:06'),(12,'Bob','Johnson','bob.johnson@example.com','$2b$10$F4BtPZKrMyK3C7H0vNz8yec3/T4WvO2wFO0H5tEvR3YwHGHfZ7dSy','Manager',0,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(13,'Charlie','Brown','charlie.brown@example.com','$2b$10$JHtPLf5ZwzNl9W7qRQyqFe8Qm8Lbb9Jj3WdMQLHih6a7Xx9aM3jYm','Admin',0,'2024-06-14 03:56:46','2024-06-14 03:56:46'),(14,'Gautam','Das','admin@prepfolders.com',NULL,'Regular',1,'2024-06-14 04:05:08','2024-06-14 04:05:08');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VolunteerOrganizations`
--

LOCK TABLES `VolunteerOrganizations` WRITE;
/*!40000 ALTER TABLE `VolunteerOrganizations` DISABLE KEYS */;
INSERT INTO `VolunteerOrganizations` VALUES (1,'VDC','Volunteering goes brrr','https://www.youtube.com/watch?v=dQw4w9WgXcQ','2024-06-03 09:12:39','2024-06-03 09:12:39'),(2,'VDC2','Volunteering goes brrr','https://www.youtube.com/watch?v=dQw4w9WgXcQ','2024-06-03 09:13:11','2024-06-03 09:13:11'),(3,'vdc','sdfsfsfsf','sfsfsf','2024-06-03 09:25:59','2024-06-03 09:25:59'),(4,'Helping Hands','A group of volunteers helping the community','https://www.helpinghands.com','2024-06-14 03:56:46','2024-06-14 03:56:46'),(5,'Green Earth','Volunteers working towards a greener planet','https://www.greenearth.com','2024-06-14 03:56:46','2024-06-14 03:56:46');
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

-- Dump completed on 2024-06-14  4:51:56
