// jobs.js
// Defines the base stats & modifiers for each job

const jobs = [
  {
    name: 'Warrior',
    hp: 20,
    strength: 10,
    dexterity: 5,
    intelligence: 5,
    attackModifier: '0.8*STR + 0.2*DEX',
    speedModifier: '0.6*DEX + 0.2*INT',
  },
  {
    name: 'Thief',
    hp: 15,
    strength: 4,
    dexterity: 10,
    intelligence: 4,
    attackModifier: '0.25*STR + 1.0*DEX + 0.25*INT',
    speedModifier: '0.8*DEX',
  },
  {
    name: 'Mage',
    hp: 12,
    strength: 5,
    dexterity: 6,
    intelligence: 10,
    attackModifier: '0.2*STR + 0.2*DEX + 1.2*INT',
    speedModifier: '0.4*DEX + 0.1*STR',
  },
];

module.exports = { jobs };
