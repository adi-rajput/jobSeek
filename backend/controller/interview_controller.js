import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.google_cred, // Path to your credentials file
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });
