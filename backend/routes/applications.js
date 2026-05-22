import express from 'express';
import checkAuth from '../middleware/auth.js';
import { getAllApplications, getApplicationById, createApplication, updateApplication, deleteApplication } from '../controllers/applicationController.js';

const router = express.Router();

router.get('/', checkAuth, getAllApplications);
router.get('/:id', checkAuth, getApplicationById);
router.post('/', checkAuth, createApplication);
router.put('/:id', checkAuth, updateApplication);
router.delete('/:id', checkAuth, deleteApplication);

export default router;
