import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],


  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
