import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import Employer from './models/employer.model.js';
import mongoose from 'mongoose';
import employerRoutes from './routes/employerRoutes.js';
import technologiesRoutes from './routes/technologiesRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import cors from 'cors';
import multer from 'multer';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const connectionString = process.env.MONGO_URI;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",   // Vite default port
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.use('/employers', employerRoutes);
app.use('/technologies', technologiesRoutes);
app.use('/projects', projectRoutes);

app.post('/new-employer', async (req, res) => {
    const emplo = req.body;
    if (!emplo.name) {
        return res.status(400).json({ success: false, message: "Please fill all fields" })
    };

    const newEmployer = new Employer(emplo);

    try {
        //If the creation works
        await newEmployer.save();
        res.status(201).json({ success: true, data: newEmployer });
    }
    catch (error) {
        //if the creation does not work
        console.error("Error creating employer:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.put('/update-employer/:id', async (req, res) => {
    const { id } = req.params;
    const employer = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        var status = res.status(404).json({ success: false, message: "invalid employer" });
        return status;
    }

    try {
        const updatedEmployer = await Employer.findByIdAndUpdate(id, employer, { new: true });
        res.status(200).json({ success: true, data: updatedEmployer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
);


app.get("/contact", (req, res) => {
    res.send("Information for contacting Francisco");
})

app.get("/", (req, res) => {
    res.send("El servidor está listo");
})

app.get("/hola", (req, res) => {
    res.send("El servidor está saludando");
});

app.get("/perritos", (req, res) => {
    res.send({
        "animal": "dog",
        "name": "Luna",
        "breed": "Labrador Retriever",
        "age": 3,
        "color": "black",
        "weightKg": 28,
        "vaccinated": true,
        "traits": [
            "friendly",
            "energetic",
            "loyal"
        ],
        "favoriteActivities": [
            "fetch",
            "swimming",
            "long walks"
        ],
        "owner": {
            "name": "Francisco",
            "city": "Santiago",
            "country": "Chile"
        }
    });
    console.log("Se ha enviado un perrito en JSON");
});

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' http://localhost:5000/employers;"
    );
    next();
});