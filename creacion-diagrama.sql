-- =========================================
-- CRM TIC2 - Esquema PostgreSQL
-- =========================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- ENUM
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'customer_status'
    ) THEN
        CREATE TYPE customer_status AS ENUM ('active', 'pending', 'inactive');
    END IF;
END$$;

-- =========================================
-- TABLA: users
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'Usuarios autenticados del CRM';
COMMENT ON COLUMN users.id IS 'Id del usuario';
COMMENT ON COLUMN users.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.email IS 'Correo electrónico del usuario';
COMMENT ON COLUMN users.password_hash IS 'Contraseña encriptada del usuario';
COMMENT ON COLUMN users.created_at IS 'Fecha de creación del usuario';
COMMENT ON COLUMN users.updated_at IS 'Fecha de actualización del usuario';

-- =========================================
-- TABLA: customers
-- =========================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    company VARCHAR(120) NOT NULL,
    status customer_status NOT NULL DEFAULT 'active',
    country VARCHAR(80) NOT NULL,
    address VARCHAR(180) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_customers_owner_user
        FOREIGN KEY (owner_user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE customers IS 'Clientes gestionados dentro del CRM';
COMMENT ON COLUMN customers.id IS 'Id del cliente';
COMMENT ON COLUMN customers.owner_user_id IS 'Id del usuario responsable del cliente';
COMMENT ON COLUMN customers.full_name IS 'Nombre completo del cliente';
COMMENT ON COLUMN customers.email IS 'Correo electrónico del cliente';
COMMENT ON COLUMN customers.phone_number IS 'Número de teléfono del cliente';
COMMENT ON COLUMN customers.company IS 'Empresa del cliente';
COMMENT ON COLUMN customers.status IS 'Estado actual del cliente';
COMMENT ON COLUMN customers.country IS 'País del cliente';
COMMENT ON COLUMN customers.address IS 'Dirección del cliente';
COMMENT ON COLUMN customers.created_at IS 'Fecha de creación del cliente';
COMMENT ON COLUMN customers.updated_at IS 'Fecha de actualización del cliente';

-- =========================================
-- TABLA: customer_status_history
-- =========================================
CREATE TABLE IF NOT EXISTS customer_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    changed_by_user_id UUID NOT NULL,
    previous_status customer_status,
    new_status customer_status NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_customer_status_history_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_customer_status_history_changed_by_user
        FOREIGN KEY (changed_by_user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE customer_status_history IS 'Historial de cambios de estado de los clientes';
COMMENT ON COLUMN customer_status_history.id IS 'Id del historial de estado';
COMMENT ON COLUMN customer_status_history.customer_id IS 'Id del cliente';
COMMENT ON COLUMN customer_status_history.changed_by_user_id IS 'Id del usuario que realizó el cambio';
COMMENT ON COLUMN customer_status_history.previous_status IS 'Estado anterior del cliente';
COMMENT ON COLUMN customer_status_history.new_status IS 'Nuevo estado del cliente';
COMMENT ON COLUMN customer_status_history.changed_at IS 'Fecha del cambio de estado';

-- =========================================
-- ÍNDICES RECOMENDADOS
-- =========================================
CREATE INDEX IF NOT EXISTS idx_customers_owner_user_id
    ON customers(owner_user_id);

CREATE INDEX IF NOT EXISTS idx_customers_status
    ON customers(status);

CREATE INDEX IF NOT EXISTS idx_customer_status_history_customer_id
    ON customer_status_history(customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_status_history_changed_by_user_id
    ON customer_status_history(changed_by_user_id);

CREATE INDEX IF NOT EXISTS idx_customer_status_history_changed_at
    ON customer_status_history(changed_at);