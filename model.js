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


// model.js
// … (existing imports & exports)

//
// simulateBattle(id1, id2, rngFn)
//  - id1, id2: the two character IDs in our in-memory store
//  - rngFn(max): returns an integer in [0..max]
// Returns: { log: string, winner: Character, loser: Character }
//

function simulateBattle(id1, id2, rngFn = max => Math.floor(Math.random()*(max+1))) {
  const c1 = characters.find(c => c.id === id1);
  const c2 = characters.find(c => c.id === id2);
  if (!c1 || !c2) throw new Error('Invalid character ID');

  const log = [];
  log.push(
    `Battle between ${c1.name} (${c1.job}) - ${c1.currentHp} HP and ` +
    `${c2.name} (${c2.job}) - ${c2.currentHp} HP begins!`
  );

  // helper: compute a numeric modifier from a formula string
  const makeCalc = formula =>
    new Function('STR','DEX','INT', `return ${formula.replace(/\s+/g,'')};`);

  const calcSpeed1  = makeCalc(c1.speedModifier);
  const calcSpeed2  = makeCalc(c2.speedModifier);
  const calcAttack1 = makeCalc(c1.attackModifier);
  const calcAttack2 = makeCalc(c2.attackModifier);

  // battle loop
  while (c1.currentHp > 0 && c2.currentHp > 0) {
    // determine first turn
    let sp1, sp2;
    do {
      sp1 = rngFn(Math.floor(calcSpeed1(c1.strength, c1.dexterity, c1.intelligence)));
      sp2 = rngFn(Math.floor(calcSpeed2(c2.strength, c2.dexterity, c2.intelligence)));
    } while (sp1 === sp2);

    const first  = sp1 > sp2 ? c1 : c2;
    const second = first === c1 ? c2 : c1;
    log.push(
      `${first.name} ${sp1} speed was faster than ` +
      `${second.name} ${sp2} speed and will begin this round.`
    );

    // first attacks
    const dmg1 = rngFn(Math.floor(calcAttack1(first.strength, first.dexterity, first.intelligence)));
    second.currentHp = Math.max(0, second.currentHp - dmg1);
    log.push(
      `${first.name} attacks ${second.name} for ${dmg1}, ` +
      `${second.name} has ${second.currentHp} HP remaining.`
    );
    if (second.currentHp === 0) break;

    // second attacks
    const dmg2 = rngFn(Math.floor(calcAttack2(second.strength, second.dexterity, second.intelligence)));
    first.currentHp = Math.max(0, first.currentHp - dmg2);
    log.push(
      `${second.name} attacks ${first.name} for ${dmg2}, ` +
      `${first.name} has ${first.currentHp} HP remaining.`
    );
    if (first.currentHp === 0) break;
  }

  const winner = c1.currentHp > 0 ? c1 : c2;
  const loser  = winner === c1 ? c2 : c1;
  log.push(
    `${winner.name} wins the battle! ${winner.name} still has ` +
    `${winner.currentHp} HP remaining!`
  );

  return {
    log: log.join('\n'),
    winner,
    loser
  };
}

function resetModel() {
  characters.length = 0;
  nextId = 1;
}





module.exports = {
  validateName,
  validateJob,
  createCharacter,
  listCharacters: listCharacterSummaries,
  getCharacterById,
  simulateBattle,
  resetModel
};
