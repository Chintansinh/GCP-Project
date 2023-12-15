CREATE TABLE `MessageInfo` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `teamId` int NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL,
  `teamName` varchar(255) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;