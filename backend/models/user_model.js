import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: '',
    },
    resume: {
        type: String,
        default: '',
    },
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        },
    ],
    experience: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['User', 'Employer', 'Admin'], // ⬅️ Define user roles
        default: 'User', // Default role is User (Contractor)
    },
    companyDetails: {
        // ⬅️ Only required for Employers
        companyName: { type: String, default: '' },
        companyAddress: { type: String, default: '' },
        verified: { type: Boolean, default: false }, // ⬅️ Admin will verify this
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
