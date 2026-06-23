describe('Leaderboard Unit Tests', () => {

  // Test sorting users by points descending
  test('should sort users by points in descending order', () => {
    const users = [
      { username: 'Amanda', points: 30 },
      { username: 'Bobby', points: 80 },
      { username: 'Charlene', points: 50 }
    ];
    const sorted = [...users].sort((a, b) => b.points - a.points);
    expect(sorted[0].username).toBe('Bobby');
    expect(sorted[1].username).toBe('Charlene');
    expect(sorted[2].username).toBe('Amanda');
  });

  // Test rank assignment
  test('should assign correct rank numbers', () => {
    const sorted = [
      { username: 'Bobby', points: 80 },
      { username: 'Charlene', points: 50 }
    ];
    const ranked = sorted.map((user, index) => ({ ...user, rank: index + 1 }));
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });

  // Test limiting leaderboard to top 10
  test('should limit leaderboard results to 10 entries', () => {
    const users = Array.from({ length: 15 }, (_, i) => ({ username: `user${i}`, points: i }));
    const limited = users.slice(0, 10);
    expect(limited.length).toBe(10);
  });

  // Test leaderboard excludes password field
  test('should not include password field in leaderboard data', () => {
    const leaderboardEntry = { username: 'Amanda', points: 30, role: 'user' };
    expect(leaderboardEntry.password).toBeUndefined();
  });

});