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
        minlength: 6 
    },
    profilePic: {
        type: String, 
        default: '' 
    },
    resume: {
        type: String, 
        default: '' 
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Application' 
    }],
    experience:{
        type:String,
        default:''
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;
