require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { connectTestDB, disconnectTestDB } = require('../../config/testDb');

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Auth Integration Tests', () => {

  // Test register endpoint
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'integrationuser',
        email: 'integration@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('integration@example.com');
  });

  // Test login endpoint
  test('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'integration@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  // Test login with wrong password
  test('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'integration@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  // Test register with missing fields
  test('should fail register with missing fields', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

});