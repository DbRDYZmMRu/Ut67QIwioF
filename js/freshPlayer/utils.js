// utils.js
export function rgbToHex(r, g, b) {
  try {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
  } catch (err) {
    console.error('Error in rgbToHex:', err.message, { r, g, b });
    return '#000000';
  }
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}