const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '7d';

describe('Auth Unit Tests', () => {
  
  // Test password hashing
  test('should hash a password', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toBeDefined();
  });

  // Test password comparison
  test('should correctly compare passwords', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  // Test wrong password comparison
  test('should fail comparison with wrong password', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    const isMatch = await bcrypt.compare('wrongpassword', hashedPassword);
    expect(isMatch).toBe(false);
  });

  // Test JWT token generation
  test('should generate a valid JWT token', () => {
    const id = '123456789';
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    expect(token).toBeDefined();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(id);
  });

  // Test invalid JWT token
  test('should fail to verify an invalid token', () => {
    expect(() => {
      jwt.verify('invalidtoken', process.env.JWT_SECRET);
    }).toThrow();
  });

});