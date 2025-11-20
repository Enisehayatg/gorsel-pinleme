-- Create database if not exists
CREATE DATABASE IF NOT EXISTS gorsel_pinleme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE gorsel_pinleme;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create pins table
CREATE TABLE IF NOT EXISTS pins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    location_name VARCHAR(100) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create saved_pins table to track when users save other pins
CREATE TABLE IF NOT EXISTS saved_pins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pin_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_save (user_id, pin_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pin_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_pins_user_id ON pins(user_id);
CREATE INDEX idx_saved_pins_user_id ON saved_pins(user_id);
CREATE INDEX idx_saved_pins_pin_id ON saved_pins(pin_id);
CREATE INDEX idx_comments_pin_id ON comments(pin_id); 