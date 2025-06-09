// tests/battle.test.js
const {
  createCharacter,
  simulateBattle,
  resetModel
} = require('../model');

describe('simulateBattle', () => {
  beforeEach(() => {
    resetModel();
  });

  test('one‐turn knockout when defender has 1 HP', () => {
    const a = createCharacter('Alpha', 'Warrior');   // max speed = 4
    const b = createCharacter('Bravo', 'Warrior');
    b.currentHp = 1;

    // RNG sequence:
    // 1) speed for Alpha = 4 (at cap)
    // 2) speed for Bravo = 3
    // 3) attack damage = 1
    const seq = [4, 3, 1];
    let idx = 0;
    const rng = max => Math.min(seq[idx++], max);

    const { log, winner, loser } = simulateBattle(a.id, b.id, rng);

    expect(winner.id).toBe(a.id);
    expect(loser.id).toBe(b.id);

    const lines = log.split('\n');
    expect(lines[1]).toBe(
      'Alpha 4 speed was faster than Bravo 3 speed and will begin this round.'
    );
    expect(lines[2]).toBe(
      'Alpha attacks Bravo for 1, Bravo has 0 HP remaining.'
    );
    expect(lines[3]).toBe(
      `Alpha wins the battle! Alpha still has ${a.currentHp} HP remaining!`
    );
  });

  test('two‐turn battle with alternating damage', () => {
    const a = createCharacter('M1', 'Mage');
    const b = createCharacter('M2', 'Mage');
    a.currentHp = a.maxHp = 2;
    b.currentHp = b.maxHp = 2;

    const seq = [1, 0, 1, 2];
    let idx = 0;
    const rng = max => Math.min(seq[idx++], max);

    const { log, winner, loser } = simulateBattle(a.id, b.id, rng);
    const lines = log.split('\n');

    expect(winner.id).toBe(b.id);
    expect(loser.id).toBe(a.id);

    expect(lines).toContain(
      'M1 1 speed was faster than M2 0 speed and will begin this round.'
    );
    expect(lines).toContain(
      'M1 attacks M2 for 1, M2 has 1 HP remaining.'
    );
    expect(lines).toContain(
      'M2 attacks M1 for 2, M1 has 0 HP remaining.'
    );
    expect(lines.slice(-1)[0]).toBe(
      'M2 wins the battle! M2 still has 1 HP remaining!'
    );
  });
});
