import express from 'express';
import { handleStreamAudio } from '../controllers/musicController.js';

const router = express.Router();

// Audio stream proxy endpoint
router.get('/stream/:fileId', handleStreamAudio);
router.get('/stream', handleStreamAudio);

export default router;
