// src/utils/auth.js
import { oauth2Client } from '../config/googleAuth.js';

export const refreshAccessToken = async () => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('Access token refreshed successfully');
    
    oauth2Client.setCredentials(credentials);
    
    return credentials;
  } catch (error) {
    console.error('Failed to refresh access token:', error.message);
    throw new Error('Token refresh failed');
  }
};

export const handleTokenError = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 401 || error.response?.status === 401 || error.message.includes('invalid_grant')) {
      console.log('Token expired, attempting refresh...');
      await refreshAccessToken();
      return await operation();
    }
    throw error;
  }
};