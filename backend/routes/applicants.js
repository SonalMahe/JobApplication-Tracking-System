import express from 'express';
import checkAuth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createApplicantSchema, updateApplicantSchema } from '../schemas/applicant.js';
import { getAllApplicants, getApplicantById, createApplicant, updateApplicant, deleteApplicant } from '../controllers/applicantController.js';

const router = express.Router();

router.get('/', checkAuth, getAllApplicants);
router.get('/:id', checkAuth, getApplicantById);
router.post('/', checkAuth, validate(createApplicantSchema), createApplicant);
router.put('/:id', checkAuth, validate(updateApplicantSchema), updateApplicant);
router.delete('/:id', checkAuth, deleteApplicant);

export default router;
