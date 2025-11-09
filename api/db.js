require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not set in .env");
}

const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("tmobile_dashboard");

    // TTL index: auto-delete docs 24h after "timestamp"
    await db.collection("tmobile_status").createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 86400 }
    );
  }
  return db;
}


module.exports = { connectDB };
