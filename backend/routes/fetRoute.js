const express = require('express');
const Book =require("../models/fetModel");
 

const router = express.Router();

router.get("/:emotion", async (req, res) => {
  const { emotion } = req.params;
  try {
    const books = await Book.find({ emotion });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports= router;
