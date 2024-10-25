import { application } from "express";
import mongoose from "mongoose";
import { type } from "os";

const JobSchema = new mongoose.Schema(
  {
    JobId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      
    },
    salary: {
      type: Number,
    },
    location: {
      type: String,
      required : true,
    },
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
      },
    ],
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    jobMetaData: {
      type: [
        {
          question: {
            type: String,
          },
        },
      ],
      default: [],
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
