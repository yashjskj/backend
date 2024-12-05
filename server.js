import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5050;
const app = express();

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

client.connect()
  .then(() => {
    db = client.db(process.env.DB_NAME); // Ensure the DB name is in your .env file
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// /create route
app.post("/create", async (req, res) => {
  console.log("POST /create - Request body:", req.body);

  try {
    // Extract data from the request body
    const { Name, post } = req.body;

    if (!Name || !post) {
      return res.status(400).json({ error: "Name and post are required fields." });
    }

    // Create a new record to insert into MongoDB
    const newDocument = {
      name: Name, // Adjust field names if necessary
      post: post,
    };

    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);

    res.status(201).json({
      message: "Record created successfully",
      result: result,
    });
  } catch (err) {
    console.error("Error while creating record:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use the /record route for other record-related actions
app.use("/record", records);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
