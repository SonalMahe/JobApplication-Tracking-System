import express from 'express';
import checkAuth from '../middleware/auth.js';
import { getAllApplicants, getApplicantById, createApplicant, updateApplicant, deleteApplicant } from '../controllers/applicantController.js';

const router = express.Router();

router.get('/', checkAuth, getAllApplicants);
router.get('/:id', checkAuth, getApplicantById);
router.post('/', checkAuth, createApplicant);
router.put('/:id', checkAuth, updateApplicant);
router.delete('/:id', checkAuth, deleteApplicant);

export default router;
