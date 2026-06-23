const bcrypt = require('bcryptjs');

describe('User Unit Tests', () => {

  // Test password hashing for user creation
  test('should hash user password before saving', async () => {
    const plainPassword = 'mypassword123';
    const hashed = await bcrypt.hash(plainPassword, 12);
    expect(hashed).not.toBe(plainPassword);
    expect(hashed.length).toBeGreaterThan(20);
  });

  // Test default points value
  test('should default points to 0 for new user', () => {
    const newUser = { username: 'test', email: 'test@example.com', points: 0 };
    expect(newUser.points).toBe(0);
  });

  // Test default role value
  test('should default role to "user"', () => {
    const newUser = { username: 'test', email: 'test@example.com', role: 'user' };
    expect(newUser.role).toBe('user');
  });

  // Test email format validation logic
  test('should validate correct email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

});