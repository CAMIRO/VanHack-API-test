# NeoRPG Backend

An in-memory Node.js/Express API to manage RPG characters and simulate battles.  
No external database—state lives in memory. Designed for easy extension as you add persistence, leveling, UI, etc.

---

## Table of Contents

1. [Requirements](#requirements)  
2. [Installation](#installation)  
3. [Running the Server](#running-the-server)  
4. [API Endpoints](#api-endpoints)  
    - [GET /jobs](#get-jobs)  
    - [POST /characters](#post-characters)  
    - [GET /characters](#get-characters-summary)  
    - [GET /characters/:id](#get-character-details)  
5. [Battle Simulation (Model Only)](#battle-simulation-model-only)  
6. [Testing](#testing)  

---

## Requirements

- **Node.js** v14 or higher  
- **npm** (comes with Node.js)  

---

## Installation

1. **Clone the repo**  
    ```bash
    git clone <your-repo-url>
    cd neorpg-backend
    ```

---

## Running the Server

```bash
npm start
```

By default the Express app listens on port 3000. You can override via the `PORT` environment variable:

```bash
PORT=4000 npm start
```

---

## API Endpoints

### GET /jobs

Returns the list of available jobs (character classes) and their base stats & modifiers.

- **URL:** `/jobs`
- **Method:** `GET`
- **Response:** `200 OK`, JSON array of job objects:
  ```json
  [
     {
        "name": "Warrior",
        "hp": 20,
        "strength": 10,
        "dexterity": 5,
        "intelligence": 5,
        "attackModifier": "0.8*STR + 0.2*DEX",
        "speedModifier": "0.6*DEX + 0.2*INT"
     },
     { /* Thief */ },
     { /* Mage */ }
  ]
  ```

### POST /characters

Create a new character from a name and one of the three jobs.

- **URL:** `/characters`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
     "name": "Alice_Wonder",
     "job": "Mage"
  }
  ```
  - `name`: 4–15 characters, letters and underscores only  
  - `job`: one of "Warrior", "Thief", "Mage"

- **Success Response:**
  - **Code:** `201 Created`
  - **Body:**
     ```json
     {
        "id": 1,
        "name": "Alice_Wonder",
        "job": "Mage",
        "maxHp": 12,
        "currentHp": 12,
        "strength": 5,
        "dexterity": 6,
        "intelligence": 10,
        "attackModifier": "0.2*STR + 0.2*DEX + 1.2*INT",
        "speedModifier": "0.4*DEX + 0.1*STR"
     }
     ```
- **Error Response:**
  - **Code:** `400 Bad Request`
  - **Body:**  
     `{ "error": "Name must be 4–15 characters long and use only letters or underscores." }`  
     or  
     `{ "error": "Job must be one of Warrior, Thief, or Mage." }`

### GET /characters

List all characters in summary form, showing only their id, name, job, and whether they are alive.

- **URL:** `/characters`
- **Method:** `GET`
- **Response:** `200 OK`
- **Body:**
  ```json
  [
     { "id": 1, "name": "Alice_Wonder", "job": "Mage",    "alive": true },
     { "id": 2, "name": "Bob_TheBrave", "job": "Warrior", "alive": false }
  ]
  ```

### GET /characters/:id

Retrieve full details for a single character.

- **URL:** `/characters/:id`
- **Method:** `GET`
- **Path Parameters:**
  - `id` (number): character’s unique ID

- **Success Response:**
  - **Code:** `200 OK`
  - **Body:**
     ```json
     {
        "id": 1,
        "name": "Alice_Wonder",
        "job": "Mage",
        "currentHp": 8,
        "maxHp": 12,
        "stats": {
          "strength": 5,
          "dexterity": 6,
          "intelligence": 10
        },
        "modifiers": {
          "attack": "0.2*STR + 0.2*DEX + 1.2*INT",
          "speed":  "0.4*DEX + 0.1*STR"
        }
     }
     ```
- **Error Response:**
  - **Code:** `404 Not Found`
  - **Body:**  
     `{ "error": "Character not found" }`

---

## Battle Simulation (Model Only)

We expose a `simulateBattle(id1, id2, rngFn?)` function in `model.js` to drive turn-based combat in your server logic or tests.  
It mutates each character’s `currentHp`, logs each round/turn, and returns:

```json
{
  "log":    "full newline-separated battle log text",
  "winner": { /* Character object */ },
  "loser":  { /* Character object */ }
}
```

> **Note:** No public HTTP endpoint is provided for battle yet—you can add one if you wish.

---

## Testing

We use Jest (with supertest pending if you add HTTP integration tests).

1. **Run all tests**
    ```bash
    npm test
    ```

2. **Coverage report**
    ```bash
    npm test -- --coverage
    ```

Test files live under `tests/`:
- `model.test.js` — validation, creation, listing, detail
- `battle.test.js` — deterministic battle-simulation scenarios