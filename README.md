# Pokemon API

A small REST API over a MongoDB `pokemon` collection — CRUD + query filtering, built for hands-on Postman practice.

## 1. Get a MongoDB instance

**Easiest: MongoDB Atlas (free tier, cloud-hosted)**
1. Go to `mongodb.com/cloud` → sign up / log in → "Create a free cluster."
2. **Database Access** → add a user (e.g. `admin` / a password you choose).
3. **Network Access** → add your current IP address (or `0.0.0.0/0` for quick testing — not for production).
4. **Databases** → "Connect" on your cluster → "Drivers" → copy the connection string. It looks like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Or run Mongo locally** if you already have it installed:
```
mongodb://localhost:27017/PokemonDB
```

## 2. Configure the connection string

Open `db/connection.js` and replace the placeholder connection string, **or** set an environment variable instead of editing the file:

```bash
export MONGO_URI="mongodb+srv://admin:<password>@<cluster-host>/PokemonDB?retryWrites=true&w=majority"
```

## 3. Install dependencies

```bash
npm install
```

## 4. Seed the database

```bash
npm run seed
```

This clears the `pokemon` collection and inserts 25 Pokemon spanning 9 regions, single- and dual-type combos, and a handful of legendaries — enough variety to actually exercise the filters.

## 5. Start the API

```bash
npm start
```

You should see:
```
Connected to MongoDB — PokemonDB
Pokemon API listening on :3000
```

## 6. Import the Postman collection

In Postman: **Import** → select `postman/Pokemon-API.postman_collection.json`.

It includes requests for every endpoint, plus deliberate failure cases (404, 400, 409) so you can see the error envelope shape, not just the happy path.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/v1/pokemon` | List, filterable by `region`, `primaryType`, `secondaryType`, `legendary`; paginate with `limit`/`offset` |
| GET | `/v1/pokemon/:id` | `:id` is the National Pokedex number |
| POST | `/v1/pokemon` | Create — `409` on duplicate `pokedexId`/`name`, `400` on missing required fields |
| PATCH | `/v1/pokemon/:id` | Partial update |
| DELETE | `/v1/pokemon/:id` | Returns `204 No Content` |

## Try these filter combinations in Postman

- `GET /v1/pokemon?region=Kanto` — everything from Kanto
- `GET /v1/pokemon?primaryType=Water&secondaryType=Dark` — AND across two fields (only Greninja matches)
- `GET /v1/pokemon?legendary=true` — legendaries only
- `GET /v1/pokemon?region=Hoenn&legendary=true` — AND across region + legendary

Notice all of these are AND-only, same limitation from the REST notes — there's no `region=Kanto OR legendary=true` here without extending the API (comma-values, a filter language, or a `/pokemon/search` POST body, same three options as before).
