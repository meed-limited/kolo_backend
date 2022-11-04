CREATE DATABASE kolostore;

USE kolostore;

CREATE TABLE
    users(
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        walletAddress VARCHAR(255) UNIQUE NOT NULL,
        objectId VARCHAR(255) UNIQUE NOT NULL,
        adsCount INT DEFAULT 0,
        daoTokenCount INT DEFAULT 0,
        LastUpdatedTime timestamp DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET UTF8;