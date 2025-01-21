// src/utils/validators.js
export const validateDateTime = (date, time) => {
  const dateTimeString = `${date} ${time}`;
  const parsedDate = new Date(dateTimeString);
  
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date or time format');
  }
  
  if (parsedDate < new Date()) {
    throw new Error('Cannot schedule interviews in the past');
  }
  
  return parsedDate;
};