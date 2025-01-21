const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateEmail: String,
  recruiterEmail: String,
  date: Date,
  time: String,
  duration: Number,
  meetLink: String,
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
