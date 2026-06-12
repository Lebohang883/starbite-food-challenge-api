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

describe('Challenge E2E Test', () => {

  let token;
  let challengeId;
  let submissionId;

  // Step 1: Register a user
  test('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'e2euser',
        email: 'e2e@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  // Step 2: Create a challenge
  test('should create a challenge', async () => {
    const res = await request(app)
      .post('/challenges')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'E2E Challenge',
        description: 'E2E test challenge',
        points: 30,
        deadline: '2026-07-01'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    challengeId = res.body.data._id;
  });

  // Step 3: Submit the challenge
  test('should submit a challenge', async () => {
    const res = await request(app)
      .post('/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        challengeId,
        notes: 'E2E submission notes'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    submissionId = res.body.data._id;
  });

  // Step 4: Approve the submission
  test('should approve the submission', async () => {
    const res = await request(app)
      .patch(`/submissions/${submissionId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('approved');
  });

  // Step 5: Check leaderboard
  test('should show user on leaderboard with points', async () => {
    const res = await request(app)
      .get('/leaderboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].points).toBeGreaterThan(0);
  });

});