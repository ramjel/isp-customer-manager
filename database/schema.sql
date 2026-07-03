-- ISP Customer Management System
-- 1. In pgAdmin4, create database: isp_customer_db
-- 2. Open Query Tool on isp_customer_db and run this file

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internet plans (predefined + custom)
CREATE TABLE IF NOT EXISTS internet_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  speed_mbps INT,
  is_predefined BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  internet_plan VARCHAR(100) NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'inactive')),
  is_archived BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_archived ON customers(is_archived);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON customers(full_name);
CREATE INDEX IF NOT EXISTS idx_customers_contact ON customers(contact_number);
CREATE INDEX IF NOT EXISTS idx_internet_plans_name ON internet_plans(name);

-- Predefined internet plans
INSERT INTO internet_plans (name, speed_mbps, is_predefined) VALUES
  ('Basic 25Mbps', 25, true),
  ('Standard 50Mbps', 50, true),
  ('Premium 100Mbps', 100, true),
  ('Ultra 200Mbps', 200, true),
  ('Business 500Mbps', 500, true)
ON CONFLICT (name) DO NOTHING;

-- Default admin user (username: admin, password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
  ('admin', 'admin@isp.local', '$2a$10$ZzK74Y1kIRlq/Frr8BPe4.bJcCVDUIC.yEpJgJumZGfuOTRTTzHr.', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Sample customers
INSERT INTO customers (full_name, contact_number, address, internet_plan, status) VALUES
  ('Juan Dela Cruz', '09171234567', '123 Rizal St, Manila', 'Standard 50Mbps', 'active'),
  ('Maria Santos', '09189876543', '45 Mabini Ave, Quezon City', 'Premium 100Mbps', 'active'),
  ('Pedro Reyes', '09201112233', '78 Luna Blvd, Makati', 'Basic 25Mbps', 'inactive');
