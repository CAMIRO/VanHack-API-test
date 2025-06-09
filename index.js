const express = require('express');
const { jobs } = require('./data/jobs');
const { validateName, validateJob, createCharacter, listCharacters } = require('./model');

const app = express();
app.use(express.json());

// GET /jobs
app.get('/jobs', (req, res) => {
  res.json(jobs);
});

// In-memory store is inside model.js
app.get('/characters', (req, res) => {
  res.json(listCharacters());
});

app.post('/characters', (req, res) => {
  const { name, job } = req.body;
  if (!validateName(name)) {
    return res.status(400).json({ error: 'Name must be 4–15 letters or underscores only.' });
  }
  if (!validateJob(job)) {
    return res.status(400).json({ error: 'Job must be one of Warrior, Thief or Mage.' });
  }
  const character = createCharacter(name, job);
  res.status(201).json(character);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
