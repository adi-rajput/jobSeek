import mongoose from "mongoose";

const AppliedSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    appliedJobs:[
       {
        job:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Job',
            required:true,
        },
        dateApplied:{
            type:Date,
            default:Date.now
        },
        status:{
            type:String,
            enum:['applied','shortlisted','rejected'],
            default:'applied'
        },
       }
    ],
},{timestamps:true});

const Applied = mongoose.model('Applied',AppliedSchema);