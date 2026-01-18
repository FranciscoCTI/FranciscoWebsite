import express from 'express';
const router = express.Router();
import { createEmployer, getEmployers, removeEmployer, replaceEmployer } from '../controllers/employer.controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

//Routes
router.get('/', getEmployers);
router.post('/', upload.single('image'), createEmployer);
router.delete('/:id', removeEmployer);
router.put('/:id', upload.single('image'), replaceEmployer);

export default router;