-- Create Database
CREATE DATABASE IF NOT EXISTS bank_management;
USE bank_management;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    account_type ENUM('Savings', 'Current', 'Fixed Deposit') DEFAULT 'Savings',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Inactive', 'Closed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    transaction_type ENUM('Deposit', 'Withdrawal', 'Transfer') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Insert Sample Users (password: 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@bank.com', '$2b$10$YQ5z8Z5Z5Z5Z5Z5Z5Z5Z5uGxN8GJ8Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zu', 'Admin User', 'admin'),
('john_doe', 'john.doe@email.com', '$2b$10$YQ5z8Z5Z5Z5Z5Z5Z5Z5Z5uGxN8GJ8Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zu', 'John Doe', 'user'),
('jane_smith', 'jane.smith@email.com', '$2b$10$YQ5z8Z5Z5Z5Z5Z5Z5Z5Z5uGxN8GJ8Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zu', 'Jane Smith', 'user');

-- Insert Sample Data
INSERT INTO accounts (account_number, account_holder_name, email, phone, account_type, balance, status) VALUES
('ACC1001', 'John Doe', 'john.doe@email.com', '1234567890', 'Savings', 5000.00, 'Active'),
('ACC1002', 'Jane Smith', 'jane.smith@email.com', '9876543210', 'Current', 10000.00, 'Active'),
('ACC1003', 'Bob Johnson', 'bob.johnson@email.com', '5551234567', 'Savings', 7500.50, 'Active');

-- Insert Sample Transactions
INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description) VALUES
(1, 'Deposit', 1000.00, 5000.00, 'Initial deposit'),
(2, 'Deposit', 5000.00, 10000.00, 'Initial deposit'),
(3, 'Deposit', 7500.50, 7500.50, 'Initial deposit');
