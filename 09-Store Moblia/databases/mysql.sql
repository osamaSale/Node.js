create database storeMobile;

use storeMobile;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL unique,
    password VARCHAR(255),
    image varchar(255),
    phone varchar(255),
    authorization varchar(255),
    cloudinary_id VARCHAR(255)
);

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    image varchar(255) NOT NULL,
    brand varchar(255) NOT NULL,
    device varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    price int NOT NULL,
    priceDiscount int NOT NULL,
    description varchar(500) NOT NULL,
    stock varchar(255) NOT NULL,
    cloudinary_id VARCHAR(255)
);

CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    message VARCHAR(30) NOT NULL
);

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30) NOT NULL unique
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    productid int NOT NULL,
     date varchar(255) NOT NULL,
    comment varchar(255) NOT NULL
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    productid int NOT NULL,
    name VARCHAR(30) NOT NULL,
    image varchar(255) NOT NULL,
    brand varchar(255) NOT NULL,
    device varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    price int NOT NULL,
    priceDiscount int NOT NULL,
    description varchar(500) NOT NULL,
    stock varchar(255) NOT NULL
);

CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    productid int NOT NULL,
    name VARCHAR(30) NOT NULL,
    image varchar(255) NOT NULL,
    brand varchar(255) NOT NULL,
    device varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    price int NOT NULL,
    priceDiscount int NOT NULL,
    description varchar(500) NOT NULL,
    stock varchar(255) NOT NULL,
    total int NOT NULL,
    quantity int NOT NULL
);

CREATE TABLE orders (
    orderid INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    checkout varchar(255) NOT NULL,
    date varchar(255) NOT NULL,
    total varchar(255) NOT NULL
);

CREATE TABLE listOrderProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId int NOT NULL,
    productid int NOT NULL,
    name VARCHAR(30) NOT NULL,
    image varchar(255) NOT NULL,
    brand varchar(255) NOT NULL,
    device varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    total int NOT NULL,
    quantity int NOT NULL,
    orderid int
);