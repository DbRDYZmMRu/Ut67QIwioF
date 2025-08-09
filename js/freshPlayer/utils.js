// utils.js
export function formatTime(seconds) {
  // Existing formatTime function (unchanged)
  try {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  } catch (err) {
    console.error('Error in formatTime:', err.message);
    return '0:00';
  }
}

export function rgbToHex(r, g, b) {
  // Existing rgbToHex function (unchanged)
  try {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  } catch (err) {
    console.error('Error in rgbToHex:', err.message);
    return '#000000';
  }
}

export function camelCaseToTitleCase(str) {
  console.log(str);
  try {
    if (!str || typeof str !== 'string') {
      return '';
    }
    // Insert space before uppercase letters and split into words
    const words = str
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(/\s+/);
    // Capitalize first letter of each word and join with spaces
    return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } catch (err) {
    console.error('Error in camelCaseToTitleCase:', err.message);
    return '';
  }
}