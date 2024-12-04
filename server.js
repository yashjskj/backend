import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";

// Environment variables setup
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: envPath });

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

client.connect().then(() => {
  db = client.db(process.env.DB_NAME);
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Forward /create directly
app.post('/create', async (req, res) => {
  console.log("POST /create - Creating a new record", req.body);
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.status(201).send({ message: 'Record created successfully', result });
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).send("Error creating record");
  }
});

// Use /record routes
app.use("/record", records);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
