const express = require('express');
const router = express.Router();
const Pokemon = require('../../model/pokemon');

function errorEnvelope(message, method, endpoint, errors) {
  return {
    message,
    timestamp: new Date().toISOString(),
    method,
    endpoint,
    errors
  };
}

// GET /v1/pokemon — list, with AND-style query filtering + pagination
// Supports: ?region=Kanto&primaryType=Fire&secondaryType=Flying&legendary=true
//           &limit=10&offset=0
router.get('/', async (req, res) => {
  try {
    const criteria = {};
    if (req.query.region) criteria.region = req.query.region;
    if (req.query.primaryType) criteria.primaryType = req.query.primaryType;
    if (req.query.secondaryType) criteria.secondaryType = req.query.secondaryType;
    if (req.query.legendary !== undefined) criteria.legendary = req.query.legendary === 'true';

    const limit = parseInt(req.query.limit) || 0;
    const offset = parseInt(req.query.offset) || 0;

    let query = Pokemon.find(criteria).sort({ pokedexId: 1 });
    if (offset) query = query.skip(offset);
    if (limit) query = query.limit(limit);

    const results = await query.exec();
    if (results.length === 0) {
      return res.status(404).json(
        errorEnvelope('No Pokemon matched the given criteria', 'GET', '/v1/pokemon', [])
      );
    }
    res.status(200).json({ data: results, meta: { count: results.length } });
  } catch (err) {
    res.status(500).json(errorEnvelope('Unexpected server error', 'GET', '/v1/pokemon', [{ code: 5000, text: err.message }]));
  }
});

// GET /v1/pokemon/:id — id is the National Pokedex number
router.get('/:id', async (req, res) => {
  try {
    const found = await Pokemon.findOne({ pokedexId: req.params.id });
    if (!found) {
      return res.status(404).json(
        errorEnvelope(`No Pokemon with pokedexId ${req.params.id}`, 'GET', `/v1/pokemon/${req.params.id}`, [])
      );
    }
    res.status(200).json(found);
  } catch (err) {
    res.status(500).json(errorEnvelope('Unexpected server error', 'GET', `/v1/pokemon/${req.params.id}`, [{ code: 5000, text: err.message }]));
  }
});

// POST /v1/pokemon — create
router.post('/', async (req, res) => {
  try {
    const created = await Pokemon.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json(errorEnvelope(
        'A Pokemon with this pokedexId or name already exists',
        'POST', '/v1/pokemon',
        [{ code: 6001, text: err.message, hint: 'Use PATCH to update the existing entry instead' }]
      ));
    }
    res.status(400).json(errorEnvelope('Validation failed', 'POST', '/v1/pokemon', [{ code: 7001, text: err.message }]));
  }
});

// PATCH /v1/pokemon/:id — partial update
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Pokemon.findOneAndUpdate(
      { pokedexId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json(
        errorEnvelope(`No Pokemon with pokedexId ${req.params.id}`, 'PATCH', `/v1/pokemon/${req.params.id}`, [])
      );
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json(errorEnvelope('Validation failed', 'PATCH', `/v1/pokemon/${req.params.id}`, [{ code: 7001, text: err.message }]));
  }
});

// DELETE /v1/pokemon/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Pokemon.findOneAndDelete({ pokedexId: req.params.id });
    if (!deleted) {
      return res.status(404).json(
        errorEnvelope(`No Pokemon with pokedexId ${req.params.id}`, 'DELETE', `/v1/pokemon/${req.params.id}`, [])
      );
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json(errorEnvelope('Unexpected server error', 'DELETE', `/v1/pokemon/${req.params.id}`, [{ code: 5000, text: err.message }]));
  }
});

module.exports = router;
