import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]
                index: "2dsphere",
            },
        },
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        myRoleOnIt: {
            type: String,
            required: true,
        },
        companyId:
        {
            type: String,
            required: true,
        },
        year:
        {
            type: Number,
            required: true
        },
        image:
        {
            type: String,
            required: true,
        }

    }, { timestamps: true, collection: 'Projects' }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;