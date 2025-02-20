import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    JobId: {
      type: String,
      required: true,
      unique: true,
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
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model for employer
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Job seekers who apply
        },
        answers: [
          {
            question: String,
            answer: String,
          },
        ],
        resume: String, // Resume file URL
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    jobMetaData: [
      {
        question: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed"], 
      default: "active",          
    },
    company: {
      type : String,
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
