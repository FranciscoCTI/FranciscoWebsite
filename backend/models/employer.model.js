import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        contactPhoneNumber: {
            type: Number,
            required: true,
        },
        isCurrent: {
            type: Boolean,
            required: true,
        },
        website: {
            type: String,
            required: true,
        },
        image:
        {
            type: String,
            required: true,
        }
    }, { timestamps: true, collection: 'Employers' }
);

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;