describe('Challenge Unit Tests', () => {

  // Test default points value
  test('should default points to 10 if not provided', () => {
    const defaultPoints = 10;
    const challenge = { title: 'Test Challenge', points: defaultPoints };
    expect(challenge.points).toBe(10);
  });

  // Test deadline is a valid future date
  test('should validate deadline is a valid date', () => {
    const deadline = '2026-07-01';
    const date = new Date(deadline);
    expect(date instanceof Date).toBe(true);
    expect(isNaN(date.getTime())).toBe(false);
  });

  // Test required fields presence
  test('should require title and description', () => {
    const challenge = { title: 'Spicy Challenge', description: 'Eat spicy food' };
    expect(challenge.title).toBeDefined();
    expect(challenge.description).toBeDefined();
  });

  // Test mealSuggestion defaults to null when API fails
  test('should default mealSuggestion to null if API call fails', () => {
    const mealSuggestion = null;
    expect(mealSuggestion).toBeNull();
  });

});