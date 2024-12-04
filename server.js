import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";

// Setup for environment variables
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: envPath });

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

// Connect to the MongoDB server
client.connect().then(() => {
  db = client.db(process.env.DB_NAME);  // Use the DB specified in the .env file
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const PORT = process.env.PORT || 5050;
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Add /create route directly in server.js to forward requests to /record route
app.post('/create', async (req, res) => {
    console.log("POST /create - Creating a new record", req.body);
    
    try {
        // Simulate the behavior of the /record route
        const newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };

        let collection = await db.collection("records");
        let result = await collection.insertOne(newDocument);
        res.status(201).send({ message: 'Record created successfully', result: result });
    } catch (err) {
        console.error("Error creating record:", err);
        res.status(500).send("Error creating record");
    }
});

// Use /record route for other record-related actions
app.use("/record", records);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
