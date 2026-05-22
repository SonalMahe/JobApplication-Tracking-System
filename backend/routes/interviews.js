import express from 'express';
import checkAuth from '../middleware/auth.js';
import { getAllInterviews, getInterviewById, createInterview, updateInterview, deleteInterview } from '../controllers/interviewController.js';

const router = express.Router();

router.get('/', checkAuth, getAllInterviews);
router.get('/:id', checkAuth, getInterviewById);
router.post('/', checkAuth, createInterview);
router.put('/:id', checkAuth, updateInterview);
router.delete('/:id', checkAuth, deleteInterview);

export default router;
