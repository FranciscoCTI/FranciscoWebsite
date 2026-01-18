import Employer from '../models/employer.model.js';
import mongoose from 'mongoose';

export const getEmployers = async (req, res) => {
    try {
        const employer = await Employer.find({});
        return res.status(200).json({
            count: employer.length,
            datum: employer
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

export const createEmployer = async (req, res) => {

    const { name, city, country, contact, contactPhoneNumber, isCurrent, website } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    if (!name ||
        !city ||
        !country ||
        !contact ||
        !contactPhoneNumber ||
        !website) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    const newEmployer = new Employer({
        name,
        city,
        country,
        contact,
        contactPhoneNumber,
        isCurrent,
        website,
        image: imagePath
    });

    try {
        await newEmployer.save();
        res.status(201).json({
            success: true,
            data: newEmployer,
            message: "Employer was created correctly"
        });
    }
    catch (error) {
        console.error("Error creating the new employer", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeEmployer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "invalid employer id" });
    }

    try {
        const deletedEmp = await Employer.findByIdAndDelete(id);

        if (!deletedEmp) {
            return res.status(404).json({ success: false, message: 'employer not found' });
        }

        res.status(201).json({ success: true, message: 'Employer deleted succesfully' });
        console.log('Employer deleted succesfully');
    }
    catch (error) {
        console.error('Error in deleting an employer:', error.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export const replaceEmployer = async (req, res) => {
    const { name, city, country, contact, contactPhoneNumber, isCurrent, website } = req.body;

    const updates = { name, city, country, contact, contactPhoneNumber, isCurrent, website };

    if (req.file) {
        updates.image = `${req.file.filename}`;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid employer id' });
    }

    try {
        const updated = await Employer.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updated);

        //res.status(201).json({ success: true, data: updated, message: 'Employer updated succesfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}