import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRoutes from './routes/User_routes.js';
import employerRoutes from  './routes/employer_routes.js';
import jobRoutes from './routes/Job_routes.js';
import applicationRoutes from './routes/application_routes.js';
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; // Add all your frontend origins here

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If your backend requires credentials like cookies
}));



dotenv.config();
app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });

//routes

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employers', employerRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
   connectDB();
  console.log(`Server is running on port ${PORT}`);
});