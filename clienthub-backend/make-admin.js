import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function makeAdmin() {
  try {
    const result = await pool.query('UPDATE users SET role = $1 WHERE id = 1 RETURNING id, email, name, role', ['admin']);
    console.log('✅ Пользователь обновлён:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

makeAdmin();
