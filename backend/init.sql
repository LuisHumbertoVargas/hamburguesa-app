CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_items (name, description, price) VALUES
('Clásica', 'Carne, queso, lechuga, tomate y cebolla', 10.99),
('BBQ', 'Carne, queso cheddar, bacon y salsa BBQ', 12.99),
('Vegana', 'Hamburguesa de lentejas, lechuga, tomate y aguacate', 11.99);

-- Insertar un usuario administrador
INSERT INTO users (email, password, role) VALUES
('admin@example.com', '$2a$10$mj1OMFvVmGAR4gEEXZGtA.R5wYWBZTis72hSXzpxmr/XfImuVyIXC', 'admin');
-- La contraseña es 'adminpassword', pero está hasheada