require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const experienceRoutes = require('./routes/experiences');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview-experiences';

app.use(express.json());

// ---- API ----
app.use('/api/experiences', experienceRoutes);
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---- Frontend ----
// public/ has index.html, style.css and app.js (the file Babel generates)
app.use(express.static(path.join(__dirname, '..', 'public')));

// React itself is loaded in index.html straight from node_modules
const modules = path.join(__dirname, '..', 'node_modules');
app.use('/vendor/react', express.static(path.join(modules, 'react', 'umd')));
app.use('/vendor/react-dom', express.static(path.join(modules, 'react-dom', 'umd')));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('Open http://localhost:' + PORT));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
