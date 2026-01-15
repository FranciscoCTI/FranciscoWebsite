import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Technology from '../models/technology.model.js';
import { createTechnology, getTechnologies, removeTechnology, replaceTechnology } from '../controllers/technology.controller.js';

//Routes
router.get('/', getTechnologies);
router.post('/', createTechnology);
router.delete('/:id', removeTechnology);
router.put('/:id', replaceTechnology);

export default router;