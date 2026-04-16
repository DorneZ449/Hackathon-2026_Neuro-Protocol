import pool from './db';

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        company VARCHAR(255),
        tags TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      );
    `);

    console.log('✅ Таблицы успешно созданы');

    // Add constraints and indexes
    console.log('📊 Добавление constraints и индексов...');

    // Unique index on lowercase email
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique
      ON users (LOWER(email));
    `);

    // Indexes for foreign keys
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_clients_created_by
      ON clients (created_by);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_client_id
      ON orders (client_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_interactions_client_id
      ON interactions (client_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_comments_client_id
      ON comments (client_id);
    `);

    // Check constraints
    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE users
          ADD CONSTRAINT users_role_check
          CHECK (role IN ('user', 'admin'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE orders
          ADD CONSTRAINT orders_status_check
          CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE orders
          ADD CONSTRAINT orders_amount_non_negative
          CHECK (amount IS NULL OR amount >= 0);
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE interactions
          ADD CONSTRAINT interactions_type_check
          CHECK (type IN ('call', 'email', 'meeting', 'message', 'note', 'other'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    console.log('✅ Constraints и индексы успешно добавлены');
  } catch (error) {
    console.error('❌ Ошибка создания таблиц:', error);
    throw error;
  }
};

createTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
