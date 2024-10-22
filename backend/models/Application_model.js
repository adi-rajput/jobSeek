import mongoose  from "mongoose";

const ApplicationSchema =  new mongoose.Schema({
        job:{
           type: mongoose.Schema.Types.ObjectId,
             ref: 'Job',
             required:true
        },
        applicants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                appliedDate: {  type:Date,
                    default:Date.now
                },
                status:{type:stringify,
                    enum:['applied','shortlisted','rejected'],
                    default:'applied'
                },
                resume:{
                    type:String,
                }
            }
        ]
    },{timestamps:true});

const Application = mongoose.model('Application',ApplicationSchema);

export default Application;