require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Google + Cloudflare DNS

const mongoose = require('mongoose');

// Fill this in with your own MongoDB Atlas connection string (or a local
// mongodb://localhost:27017/PokemonDB if you're running Mongo locally).
//
// Atlas example:
// mongodb+srv://<user>:<password>@<cluster-host>/PokemonDB?retryWrites=true&w=majority
//
// Load from environment variable - NEVER hardcode credentials
const CONNECTION_STRING = process.env.MONGO_URI;

function connect() {
  if (!CONNECTION_STRING) {
    console.error(
      'MONGO_URI is not set. Define it as an environment variable (e.g. in the ' +
      'Render dashboard under Environment) or in a local .env file.'
    );
    process.exit(1);
  }
  return mongoose.connect(CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB — PokemonDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = { connect };
