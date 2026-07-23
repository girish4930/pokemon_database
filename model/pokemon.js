const mongoose = require('mongoose');

const VALID_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
  'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark',
  'Steel', 'Fairy'
];

const VALID_REGIONS = [
  'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'
];

const statsSchema = new mongoose.Schema({
  hp: { type: Number, required: true },
  attack: { type: Number, required: true },
  defense: { type: Number, required: true },
  spAttack: { type: Number, required: true },
  spDefense: { type: Number, required: true },
  speed: { type: Number, required: true }
}, { _id: false });

const pokemonSchema = new mongoose.Schema({
  pokedexId: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  region: { type: String, required: true, enum: VALID_REGIONS },
  primaryType: { type: String, required: true, enum: VALID_TYPES },
  // secondaryType is optional — plenty of Pokemon are single-typed
  secondaryType: { type: String, enum: VALID_TYPES, default: null },
  abilities: { type: [String], default: [] },
  heightM: { type: Number, required: true },
  weightKg: { type: Number, required: true },
  legendary: { type: Boolean, default: false },
  stats: { type: statsSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pokemon', pokemonSchema);
module.exports.VALID_TYPES = VALID_TYPES;
module.exports.VALID_REGIONS = VALID_REGIONS;
