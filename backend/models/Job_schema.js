import { application } from "express";
import mongoose from "mongoose";

const JobSchema  =  new mongoose.Schema({
    JobId:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    salary:{
        type:Number,
    },
    location:{
        type:String,
    },
    company:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Employer'
        }
    ],
    applicants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application'
        }
    ]
},{timestamps:true});

const Job = mongoose.model('Job',JobSchema);
export default Job;