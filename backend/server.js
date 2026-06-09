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
import path from "path";
import { clerkClient } from "@clerk/express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const connectionString = process.env.MONGO_URI;

app.use(express.json());

if (process.env.NODE_ENV != "production") {
    app.use(cors({
        origin: "http://localhost:5173",   // Vite default port
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.get("/api/APS", (req, res) => {
    res.send("APS viewer");
})

app.use('/uploads', express.static('uploads'));

app.use('/api/employers', employerRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/projects', projectRoutes);

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

app.get("/api/token", async (req, res) => {

    const response = await fetch(
        "https://developer.api.autodesk.com/authentication/v2/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: process.env.APS_CLIENT_ID,
                client_secret: process.env.APS_CLIENT_SECRET,
                grant_type: "client_credentials",
                scope: "data:read"
            })
        }
    );

    const data = await response.json();

    res.json(data);

});


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    console.log("This is the main location: " + __dirname);

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
    console.log("NODE_ENV:", process.env.NODE_ENV);
});
