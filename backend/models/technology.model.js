import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        usedIn: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        userLevel: {
            type: String,
            required: true,
        },
        website: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    }, { timestamps: true, collection: 'Technologies' }
);

const Technology = mongoose.model("Technology", technologySchema);
export default Technology;