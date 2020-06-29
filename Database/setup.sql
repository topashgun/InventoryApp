CREATE DATABASE
IF NOT EXISTS containers;

ALTER USER 'user1'@'%' IDENTIFIED WITH mysql_native_password BY 'user1';

flush privileges;

DROP TABLE IF EXISTS `tbl_containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_containers` (
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `contains` varchar(255) DEFAULT NULL,
  `hierarchy` varchar(9999) DEFAULT NULL,
  `identifier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;