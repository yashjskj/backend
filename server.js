import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../config.env");
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/record", records);

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal server error");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
