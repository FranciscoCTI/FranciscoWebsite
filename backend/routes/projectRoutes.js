import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Project from '../models/proyect.model.js';
import { createProject, getProjects, removeProject, replaceProject } from '../controllers/project.controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

//Routes
router.get('/', getProjects);
router.post('/', upload.single('image'), createProject);
router.delete('/:id', removeProject);
router.put('/:id', upload.single('image'), replaceProject);

export default router;