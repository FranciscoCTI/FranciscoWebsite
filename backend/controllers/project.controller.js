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

    if (!projectInput.title ||
        !projectInput.latitude ||
        !projectInput.longitude ||
        !projectInput.description ||
        !projectInput.type ||
        !projectInput.myRoleOnIt) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    const newProject = new Project(projectInput);

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
    const { id } = req.params;
    const proj = req.body;

    console.log('process of replacing');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid project id' });
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate(id, emp, { new: true });
        res.status(201).json({ success: true, data: updatedProject, message: 'Project updated succesfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}