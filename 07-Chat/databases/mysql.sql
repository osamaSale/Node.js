create database chat;

use chat;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL unique,
    password VARCHAR(255),
    image varchar(255),
    phone varchar(255),
    bio varchar(255),
    twitter varchar(255),
    facebook varchar(255),
    instagram varchar(255),
    location varchar(255),
    cloudinary_id VARCHAR(255)
);

CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    friendId int NOT NULL,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    image varchar(255),
    phone varchar(255),
    bio varchar(255)
);

CREATE TABLE chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderId int NOT NULL,
    receiverId int NOT NULL,
    senderName VARCHAR(30) NOT NULL,
    senderEmail VARCHAR(30) NOT NULL,
    senderImage varchar(255),
    senderPhone varchar(255),
    senderBio varchar(255),
    receiverName VARCHAR(30) NOT NULL,
    receiverEmail VARCHAR(30) NOT NULL,
    receiverImage varchar(255),
    receiverPhone varchar(255),
    receiverBio varchar(255)
);

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chatId int NOT NULL,
    senderId int NOT NULL,
    receiverId int NOT NULL,
    senderName VARCHAR(30) NOT NULL,
    senderImage varchar(255),
    receiverName VARCHAR(30) NOT NULL,
    receiverImage varchar(255),
    text varchar(255),
    cloudinary_id VARCHAR(255)
);