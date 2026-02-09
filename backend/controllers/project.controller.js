import Project from '../models/proyect.model.js';
import mongoose from 'mongoose';

export const getProjects = async (req, res) => {
    try {
        const project = await Project.find({});
        return res.status(200).json({
            count: project.length,
            datum: project
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    const projectInput = req.body;

    const { title, type, companyId, description, year, myRoleOnIt, lat, lng } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    if (!projectInput.title ||
        !projectInput.description ||
        !projectInput.year ||
        !projectInput.type ||
        !projectInput.myRoleOnIt) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    const newProject = new Project({
        title,
        type,
        description,
        myRoleOnIt,
        companyId,
        year,
        image: imagePath,
        location: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
        }
    });

    try {
        await newProject.save();
        res.status(201).json({
            success: true,
            data: newProject,
            message: "Project was created correctly"
        });
    }
    catch (error) {
        console.error("Error creating the new project", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProy = await Project.findByIdAndDelete(id);

        if (!deletedProy) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(201).json({ success: true, message: 'Project deleted succesfully' });
        console.log('Project deleted succesfully');
    }
    catch (error) {
        console.error('Error in deleting a project:', error);
        res.status(500).send("Something went wrong");
    }
};

export const replaceProject = async (req, res) => {
    const { title, location, type, description, myRoleOnIt, companyId, year } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid project id' });
    }

    const updates = { title, type, description, myRoleOnIt, companyId, year };

    if (location?.lat != null && location?.lng != null) {
        updates.location = {
            type: "Point",
            coordinates: [location.lng, location.lat],
        };
    }

    if (req.file) {
        updates.image = `${req.file.filename}`;
    }

    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}