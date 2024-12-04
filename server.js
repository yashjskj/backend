import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import path from "path";

// Setup for environment variables
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5050;
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Add /create route directly in server.js
app.post('/create', (req, res) => {
    // You can handle the logic for creating a record here or simply pass it to the /record route
    console.log("POST /create - Creating a new record", req.body);
    
    // You can send a response here or call a function to handle the logic
    res.send('Create Route');
});

// Use /record route for other record-related actions
app.use("/record", records);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
