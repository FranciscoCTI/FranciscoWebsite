import Technology from '../models/technology.model.js';
import mongoose from 'mongoose';

export const getTechnologies = async (req, res) => {
    try {
        const technology = await Technology.find({});
        return res.status(200).json({
            count: technology.length,
            datum: technology
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

export const createTechnology = async (req, res) => {
    const technologyInput = req.body;

    if (!technologyInput.name ||
        !technologyInput.usedIn ||
        !technologyInput.year ||
        !technologyInput.userLevel ||
        !technologyInput.website) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    const newTechnology = new Technology(technologyInput);

    try {
        await newTechnology.save();
        res.status(201).json({
            success: true,
            data: newTechnology,
            message: "Technology was created correctly"
        });
    }
    catch (error) {
        console.error("Error creating the new technology", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTech = await Technology.findByIdAndDelete(id);

        if (!deletedTech) {
            return res.status(404).json({ success: false, message: 'Technology not found' });
        }

        res.status(201).json({ success: true, message: 'Technology deleted succesfully' });
        console.log('Technology deleted succesfully');
    }
    catch (error) {
        console.error('Error in deleting a technology:', error);
        res.status(500).send("Something went wrong");
    }
};

export const replaceTechnology = async (req, res) => {
    const { id } = req.params;
    const tech = req.body;

    console.log('process of replacing');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid employer id' });
    }

    try {
        const updatedTechnology = await Technology.findByIdAndUpdate(id, tech, { new: true });
        res.status(201).json({ success: true, data: updatedTechnology, message: 'Technology updated succesfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}