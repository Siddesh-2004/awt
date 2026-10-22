const express = require('express');
const Experience = require('../models/Experience');

const router = express.Router();

// GET /api/experiences  -> everything, newest first
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch experiences' });
  }
});

// GET /api/experiences/:id -> a single experience
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (err) {
    // invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(500).json({ message: 'Could not fetch experience' });
  }
});

// POST /api/experiences -> publish a new experience
router.post('/', async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Could not save experience' });
  }
});

module.exports = router;
