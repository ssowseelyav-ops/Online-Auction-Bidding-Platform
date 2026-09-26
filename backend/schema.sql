CREATE DATABASE IF NOT EXISTS bidvault;
USE bidvault;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('BUYER', 'SELLER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80),
  description TEXT,
  product_condition VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_seller FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auctions (
  auction_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  seller_id INT NOT NULL,
  starting_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('upcoming', 'active', 'ended') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auctions_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_auctions_seller FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bids (
  bid_id INT AUTO_INCREMENT PRIMARY KEY,
  auction_id INT NOT NULL,
  bidder_id INT NOT NULL,
  bid_amount DECIMAL(12,2) NOT NULL,
  bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bids_auction FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
  CONSTRAINT fk_bids_bidder FOREIGN KEY (bidder_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, phone, role) VALUES
('Demo Buyer', 'buyer@bidvault.com', '$2b$10$1L2ilxpB1eGD.pLgKbkhY.uq6/wSKz7vmZVW8aKqTWXEtyNsl4Pdm', '9876543210', 'BUYER'),
('Demo Seller', 'seller@bidvault.com', '$2b$10$1L2ilxpB1eGD.pLgKbkhY.uq6/wSKz7vmZVW8aKqTWXEtyNsl4Pdm', '9876543211', 'SELLER')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO products (seller_id, name, category, description, product_condition, image_url) VALUES
(2, 'iPhone 15 Pro', 'Electronics', 'Premium flagship smartphone with titanium design and A17 Pro performance.', 'New', 'https://images.unsplash.com/photo-1676404667112-a4f3a32095fe'),
(2, 'Sony Alpha Camera', 'Camera', 'Professional mirrorless camera with exceptional image quality.', 'Like New', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'),
(2, 'Gaming Laptop', 'Gaming', 'High-performance gaming laptop for serious players.', 'New', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO auctions (product_id, seller_id, starting_price, current_price, start_time, end_time, status) VALUES
(1, 2, 50000, 72500, NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 'active'),
(2, 2, 30000, 35000, NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 'active'),
(3, 2, 45000, 48000, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 'active')
ON DUPLICATE KEY UPDATE current_price = VALUES(current_price);
