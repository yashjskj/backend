import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
  console.log("GET /record - Fetching all records");
  try {
    const collection = db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).send("Error fetching records");
  }
});

// Get a single record by ID
router.get("/:id", async (req, res) => {
  console.log(`GET /record/${req.params.id} - Fetching record by ID`);
  try {
    const collection = db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error fetching record by ID:", err);
    res.status(500).send("Error fetching record by ID");
  }
});

// Create a new record
router.post("/", async (req, res) => {
  console.log("POST /record - Creating a new record", req.body);
  try {
    const { name, position, level } = req.body;

    // Validation
    if (!name || !position || !level) {
      return res.status(400).send("Missing required fields: name, position, or level");
    }

    const newDocument = { name, position, level };
    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.status(201).send({ message: "Record created successfully", result });
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).send("Error creating record");
  }
});

// Update a record by ID
router.patch("/:id", async (req, res) => {
  console.log(`PATCH /record/${req.params.id} - Updating record`, req.body);
  try {
    const { name, position, level } = req.body;
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $set: { name, position, level } };

    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send({ message: "Record updated successfully", result });
    }
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).send("Error updating record");
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  console.log(`DELETE /record/${req.params.id} - Deleting record`);
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send({ message: "Record deleted successfully", result });
    }
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
