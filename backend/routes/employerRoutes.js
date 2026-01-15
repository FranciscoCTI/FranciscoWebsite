import express from 'express';
const router = express.Router();
import { createEmployer, getEmployers, removeEmployer, replaceEmployer } from '../controllers/employer.controller.js';

//Routes
router.get('/', getEmployers);
router.post('/', createEmployer);
router.delete('/:id', removeEmployer);
router.put('/:id', replaceEmployer);

export default router;