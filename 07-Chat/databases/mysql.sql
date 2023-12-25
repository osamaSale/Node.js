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

CREATE TABLE group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
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
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    image varchar(255),
    phone varchar(255),
    bio varchar(255)
);