import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  console.log("GET /record - Fetching all records");
  try {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).send("Error fetching records");
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  console.log(`GET /record/${req.params.id} - Fetching record by ID`);
  try {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

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

// This section will help you create a new record.
router.post("/", async (req, res) => {
  console.log("POST /record - Creating a new record", req.body);
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };

    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.status(201).send({ message: "Record created successfully", result: result });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  console.log(`PATCH /record/${req.params.id} - Updating record`, req.body);
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  console.log(`DELETE /record/${req.params.id} - Deleting record`);
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let collection = await db.collection("records");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
