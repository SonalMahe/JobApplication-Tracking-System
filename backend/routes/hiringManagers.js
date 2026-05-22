import express from 'express';
import checkAuth from '../middleware/auth.js';
import { getAllManagers, getManagerById, createManager, updateManager, deleteManager } from '../controllers/hiringManagerController.js';

const router = express.Router();

router.get('/', checkAuth, getAllManagers);
router.get('/:id', checkAuth, getManagerById);
router.post('/', checkAuth, createManager);
router.put('/:id', checkAuth, updateManager);
router.delete('/:id', checkAuth, deleteManager);

export default router;
