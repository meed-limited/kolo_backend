CREATE DATABASE kolostore;

USE kolostore;

CREATE TABLE
    projects(
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        chainId INT UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        cardImage VARCHAR(255) NOT NULL,
        tagLine VARCHAR(255) NOT NULL,
        organizationName VARCHAR(255) NOT NULL,
        organizationWebsite VARCHAR(255) NOT NULL,
        youtubeLink VARCHAR(255) NOT NULL,
        contactLastname VARCHAR(255) NOT NULL,
        contactOthernames VARCHAR(255) NOT NULL,
        walletAddress VARCHAR(255) NOT NULL,
        senderAddress VARCHAR(255) NOT NULL,
        LastUpdatedTime timestamp DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET UTF8;