const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./db/connection');
const pokemonRoutes = require('./api/v1/pokemon');

const app = express();
app.use(bodyParser.json());
app.use('/v1/pokemon', pokemonRoutes);

const PORT = process.env.PORT || 3000;

connect().then(() => {
  app.listen(PORT, () => console.log(`Pokemon API listening on :${PORT}`));
});
