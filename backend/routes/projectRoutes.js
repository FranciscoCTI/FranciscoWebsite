import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Project from '../models/proyect.model.js';
import { createProject, getProjects, removeProject, replaceProject } from '../controllers/project.controller.js';

//Routes
router.get('/', getProjects);
router.post('/', createProject);
router.delete('/:id', removeProject);
router.put('/:id', replaceProject);

export default router;