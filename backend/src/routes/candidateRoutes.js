const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Joi = require('joi');
const Candidate = require('../models/Candidate');

// Multer setup for PDF resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Validation schema
const candidateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  jobTitle: Joi.string().required(),
});

// POST /candidates
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { error } = candidateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let resumeUrl = '';
    if (req.file) {
      resumeUrl = req.file.path;
    }

    const candidate = new Candidate({
      ...req.body,
      resumeUrl,
    });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /candidates/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Hired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /candidates/:id
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 