CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED') DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_store_id (store_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  qty INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders_archive (
  id INT NOT NULL,
  store_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED'),
  created_at TIMESTAMP,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);