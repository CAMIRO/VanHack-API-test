// model.js
const { jobs } = require('./data/jobs');

let nextId = 1;
const characters = [];

function validateName(name) {
  return typeof name === 'string' && /^[A-Za-z_]{4,15}$/.test(name);
}

function validateJob(job) {
  return jobs.some(j => j.name === job);
}

function createCharacter(name, jobName) {
  const job = jobs.find(j => j.name === jobName);
  const char = {
    id: nextId++,
    name,
    job: job.name,
    hp: job.hp,
    currentHp: job.hp,
    strength: job.strength,
    dexterity: job.dexterity,
    intelligence: job.intelligence,
    attackModifier: job.attackModifier,
    speedModifier: job.speedModifier,
  };
  characters.push(char);
  return char;
}

function listCharacterSummaries() {
  return characters.map(c => ({
    id: c.id,
    name: c.name,
    job: c.job,
    alive: c.currentHp > 0
  }));
}

function getCharacterById(id) {
  return characters.find(c => c.id === id);
}

module.exports = {
  validateName,
  validateJob,
  createCharacter,
  listCharacters: listCharacterSummaries,
  getCharacterById
};
