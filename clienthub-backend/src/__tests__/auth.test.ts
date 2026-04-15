import request from 'supertest';
import app from '../server';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email');
  });

  it('should not register with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const email = `test${Date.now()}@example.com`;

    // First register
    await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Test User'
      });

    // Then login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
