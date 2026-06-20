const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth'); // Aapka protect middleware

// 1. Home screen par top 4 reviews fetch karne ke liye (Public Route)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(4);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Logged-in user ke review submit karne ke liye (Protected Route)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user.id,
      name: req.user.name,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;