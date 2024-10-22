import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Ensure a minimum password length
    },
    profilePic: {
        type: String, // URL for the profile picture
        default: '' // Default empty string if no picture provided
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'], // Role can be 'user', 'admin', or 'employer'
    //     default: 'user' // Default role is 'user'
    // },
    resume: {
        type: String, // URL for resume file (e.g., Cloudinary URL)
        default: '' // Default empty string if no resume uploaded
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId, // Store references to Job model
        ref: 'Application' // Referencing 'Job' model
    }],
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set to the current date and updated when changes are made
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

const User = mongoose.model('User', userSchema);

export default User;
