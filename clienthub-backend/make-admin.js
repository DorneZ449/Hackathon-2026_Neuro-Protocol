import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://clienthub_6kyv_user:I95ej0rBcX0A3u1cEPpwj8zOXLJ3YSqn@dpg-d7ekae6rnols73ei2vr0-a.frankfurt-postgres.render.com/clienthub_6kyv',
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
