import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
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
            required: false,
        },
        year:
        {
            type: Number,
            required: false
        }

    }, { timestamps: true, collection: 'Projects' }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;