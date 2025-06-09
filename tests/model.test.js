const {
  validateName,
  validateJob,
  createCharacter,
  listCharacters,
  getCharacterById
} = require('../model');
const { jobs } = require('../data/jobs');

describe('Character Model', () => {
  beforeEach(() => {
    const m = require('../model');
    m.__proto__.characters = [];
    m.__proto__.nextId = 1;
  });

  test('validateName accepts valid and rejects invalid names', () => {
    expect(validateName('Hero_One')).toBe(true);
    expect(validateName('aaaa')).toBe(true);
    expect(validateName('abc')).toBe(false);
    expect(validateName('Bad-Name')).toBe(false);
  });

  test('validateJob accepts known jobs and rejects unknown', () => {
    jobs.forEach(j => expect(validateJob(j.name)).toBe(true));
    expect(validateJob('Paladin')).toBe(false);
  });

  test('createCharacter produces correct full object and getCharacterById retrieves it', () => {
    const jobDef = jobs.find(j => j.name === 'Warrior');
    const c = createCharacter('TestHero', 'Warrior');
    expect(c).toMatchObject({
      id:             1,
      name:           'TestHero',
      job:            'Warrior',
      hp:          jobDef.hp,
      currentHp:      jobDef.hp,
      strength:       jobDef.strength,
      dexterity:      jobDef.dexterity,
      intelligence:   jobDef.intelligence,
      attackModifier: jobDef.attackModifier,
      speedModifier:  jobDef.speedModifier
    });

    expect(getCharacterById(1)).toEqual(c);
  });

  test('listCharacters returns summary fields for each character', () => {
    createCharacter('TestHero', 'Warrior');
    const list = listCharacters();
    const first = list[0];

    expect(first).toEqual({
      id:    1,
      name:  'TestHero',
      job:   'Warrior',
      alive: true
    });
    expect(Object.keys(first).sort()).toEqual(['alive','id','job','name'].sort());
  });
});
