const { connect } = require('../db/connection');
const Pokemon = require('../model/pokemon');
const seedData = require('../data/seed.json');
const mongoose = require('mongoose');

async function run() {
  await connect();
  await Pokemon.deleteMany({});
  const inserted = await Pokemon.insertMany(seedData);
  console.log(`Seeded ${inserted.length} Pokemon into PokemonDB.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
