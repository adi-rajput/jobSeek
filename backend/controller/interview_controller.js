

// src/controllers/interview.controller.js
import { google } from 'googleapis';
import { oauth2Client } from '../config/googleAuth.js';
import { validateDateTime } from '../utils/validators.js';
import { handleTokenError } from '../utils/auth.js';
import crypto from 'crypto';

export const scheduleInterview = async (req, res) => {
  try {
    const { date, time, duration, interviewTitle = 'Interview' } = req.body;

    // Validate required fields
    if (!date || !time || !duration) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['date', 'time', 'duration']
      });
    }

    // Validate duration
    if (typeof duration !== 'number' || duration <= 0 || duration > 480) {
      return res.status(400).json({ 
        error: 'Invalid duration. Must be between 1 and 480 minutes' 
      });
    }

    const startDateTime = validateDateTime(date, time);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: interviewTitle,
      description: 'Scheduled interview meeting',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: crypto.randomBytes(16).toString('hex'),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        },
      },
    };

    const response = await handleTokenError(async () => {
      return await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });
    });

    res.status(200).json({
      message: 'Interview scheduled successfully',
      meetLink: response.data.hangoutLink,
      eventId: response.data.id,
      startTime: startDateTime,
      endTime: endDateTime
    });

  } catch (error) {
    console.error('Error scheduling interview:', error);
    
    if (error.message.includes('Invalid date')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: 'Failed to schedule interview',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

