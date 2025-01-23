import express from 'express';
import dotenv from 'dotenv';

const router = express.Router();    

router.route("/").post(register);