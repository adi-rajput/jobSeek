import mongoose from "mongoose";

const employerSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    company:{
        type:String,
    },
    profilePic:{
        type:String,
        default:'',
    },
    companyLogo:{
        type:String,
        default:'',
    },
    createdAt:{             
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    jobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    }]
},{timestamps:true});

const Employer = mongoose.model('Employer',employerSchema);
export default Employer; 