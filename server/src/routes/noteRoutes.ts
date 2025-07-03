import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createNote, deleteNote, getNotes } from '../controllers/noteController';

const router = Router();
router.get('/notes', authenticate, getNotes);
router.post('/notes', authenticate, createNote);
router.delete('/notes/:id', authenticate, deleteNote);

export default router;