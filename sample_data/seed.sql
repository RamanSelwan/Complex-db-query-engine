
-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample data into users table
INSERT INTO users (name, email) VALUES
('Alice Smith', 'alice@example.com'),
('Bob Johnson', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('David Miller', 'david@example.com'),
('Eva Green', 'eva@example.com'),
('Frank White', 'frank@example.com'),
('Grace Lee', 'grace@example.com'),
('Henry Adams', 'henry@example.com'),
('Ivy Wilson', 'ivy@example.com'),
('Jack Black', 'jack@example.com');

-- Insert sample data into products table
INSERT INTO products (name, price) VALUES
('Laptop', 999.99),
('Smartphone', 499.99),
('Tablet', 299.99),
('Headphones', 149.99),
('Smartwatch', 199.99),
('Camera', 799.99),
('Printer', 249.99),
('Monitor', 179.99);

-- Insert sample data into orders table
INSERT INTO orders (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 1, 1),
(3, 3, 3),
(4, 4, 2),
(5, 5, 1),
(6, 6, 1),
(7, 7, 2),
(8, 8, 3),
(9, 2, 1),
(9, 4, 2),
(10, 1, 2),
(10, 6, 1),
(5, 3, 2),
(6, 2, 3),
(7, 8, 1),
(3, 5, 2),
(2, 7, 1),
(4, 2, 1),
(8, 1, 1);
