import express from 'express';
import { syllabusData } from '../data/syllabusData.js';
import { labExperimentsData } from '../data/labExperimentsData.js';
import { mockQuestionsData } from '../data/mockQuestionsData.js';
import { placementData } from '../data/placementData.js';
import {
  generateTutorAnswer,
  evaluateLabCode,
  runVivaTurn,
  analyzeCode,
  generateRevisionNotes
} from '../services/geminiService.js';
import { isGeminiConfigured } from '../config/gemini.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'DSA MASTER AI Backend',
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString()
  });
});

// 1. AI DSA TUTOR
router.post('/tutor/ask', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }
    const answer = await generateTutorAnswer(query);
    res.json({ success: true, ...answer });
  } catch (err) {
    console.error('Tutor route error:', err);
    res.status(500).json({ error: 'Failed to generate tutor response', details: err.message });
  }
});

// 2. SYLLABUS TRACKER
router.get('/syllabus', (req, res) => {
  res.json({ success: true, units: syllabusData });
});

router.get('/syllabus/:unit', (req, res) => {
  const unitNum = parseInt(req.params.unit, 10);
  const found = syllabusData.find(u => u.unit === unitNum);
  if (!found) return res.status(404).json({ error: `Unit ${unitNum} not found` });
  res.json({ success: true, unit: found });
});

// 3. LAB EXPERIMENTS DATABASE
router.get('/labs', (req, res) => {
  res.json({ success: true, experiments: labExperimentsData });
});

router.get('/labs/:id', (req, res) => {
  const expId = parseInt(req.params.id, 10);
  const found = labExperimentsData.find(e => e.id === expId);
  if (!found) return res.status(404).json({ error: `Experiment ${expId} not found` });
  res.json({ success: true, experiment: found });
});

// 4. LAB EXAM SIMULATOR
router.post('/lab-simulator/evaluate', async (req, res) => {
  try {
    const { question, studentCode, timeTakenMinutes } = req.body;
    if (!question || !studentCode) {
      return res.status(400).json({ error: 'Question and studentCode are required' });
    }
    const evaluation = await evaluateLabCode({ question, studentCode, timeTakenMinutes });
    res.json({ success: true, evaluation });
  } catch (err) {
    console.error('Lab simulator route error:', err);
    res.status(500).json({ error: 'Failed to evaluate lab code', details: err.message });
  }
});

// 5. VIVA TRAINER
router.post('/viva/turn', async (req, res) => {
  try {
    const { topic, history, studentAnswer, currentScore, difficulty } = req.body;
    const vivaResult = await runVivaTurn({ topic, history, studentAnswer, currentScore, difficulty });
    res.json({ success: true, ...vivaResult });
  } catch (err) {
    console.error('Viva trainer route error:', err);
    res.status(500).json({ error: 'Failed to process viva turn', details: err.message });
  }
});

// 6. CODE ANALYZER
router.post('/code/analyze', async (req, res) => {
  try {
    const { code, userGoal } = req.body;
    if (!code) return res.status(400).json({ error: 'C code is required' });
    const analysis = await analyzeCode({ code, userGoal });
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Code analyzer route error:', err);
    res.status(500).json({ error: 'Failed to analyze code', details: err.message });
  }
});

// 8. LAST MINUTE REVISION
router.get('/revision', async (req, res) => {
  try {
    const { mode = '15min', unit = 'all' } = req.query;
    const notes = await generateRevisionNotes({ mode, unit });
    res.json({ success: true, notes });
  } catch (err) {
    console.error('Revision route error:', err);
    res.status(500).json({ error: 'Failed to generate revision notes', details: err.message });
  }
});

// 9. SMART QUESTION BANK
router.get('/questions', (req, res) => {
  const { unit, type, difficulty } = req.query;
  let result = { ...mockQuestionsData };

  if (type && result[type]) {
    let filtered = result[type];
    if (unit) filtered = filtered.filter(q => q.unit === parseInt(unit, 10));
    if (difficulty) filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    return res.json({ success: true, type, questions: filtered });
  }

  res.json({ success: true, questions: result });
});

// 10. PLACEMENT MODE
router.get('/placement', (req, res) => {
  res.json({ success: true, modules: placementData });
});

export default router;
