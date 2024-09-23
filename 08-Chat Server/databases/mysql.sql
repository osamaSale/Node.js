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
    senderName VARCHAR(30) NOT NULL,
    senderImage varchar(255),
    text varchar(255),
    image varchar(255),
    date varchar(255) NOT NULL,
    time varchar(255) NOT NULL,
    cloudinary_id VARCHAR(255)
);

CREATE TABLE chatGroup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    nameAdmin VARCHAR(30) NOT NULL,
    imageAdmin VARCHAR(255) NOT NULL,
    name VARCHAR(30) NOT NULL,
    image VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    cloudinary_id VARCHAR(255)
);

CREATE TABLE chatGroupUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    groupId int NOT NULL,
    userId int NOT NULL,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    image varchar(255),
    phone varchar(255),
    bio varchar(255),
    isAdmin VARCHAR(30)
);

CREATE TABLE chatGroupMessage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    groupId int NOT NULL,
    userId int NOT NULL,
    userName VARCHAR(30) NOT NULL,
    userImage varchar(255),
    text varchar(255),
    image varchar(255),
    date varchar(255) NOT NULL,
    time varchar(255) NOT NULL,
    cloudinary_id VARCHAR(255)
);