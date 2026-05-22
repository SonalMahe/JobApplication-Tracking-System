import express from 'express';
import checkAuth from '../middleware/auth.js';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', checkAuth, getAllJobs);
router.get('/:id', checkAuth, getJobById);
router.post('/', checkAuth, createJob);
router.put('/:id', checkAuth, updateJob);
router.delete('/:id', checkAuth, deleteJob);

export default router;
