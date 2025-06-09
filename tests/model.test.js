const {
  validateName,
  validateJob,
  createCharacter,
  listCharacters
} = require('../model');
const { jobs } = require('../data/jobs');

describe('Name validation', () => {
  test('accepts valid names', () => {
    expect(validateName('Hero_One')).toBe(true);
    expect(validateName('aaaa')).toBe(true);
  });
  test('rejects invalid names', () => {
    expect(validateName('abc')).toBe(false);
    expect(validateName('Bad-Name')).toBe(false);
  });
});

describe('Job validation', () => {
  it('recognizes all defined jobs', () => {
    jobs.forEach(j => expect(validateJob(j.name)).toBe(true));
  });
  it('rejects unknown jobs', () => {
    expect(validateJob('Paladin')).toBe(false);
  });
});

describe('Character creation', () => {
  beforeEach(() => {
    const m = require('../model');
    m.__proto__.characters = [];
    m.__proto__.nextId = 1;
  });

  it('builds a proper character object', () => {
    const c = createCharacter('TestHero', 'Warrior');
    expect(c.id).toBe(1);
    expect(c.name).toBe('TestHero');
    expect(listCharacters()).toContainEqual(c);
  });
});
