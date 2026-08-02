/**
 * Security & Sanitization Utilities
 */

/**
 * Escapes unsafe HTML characters to prevent Cross-Site Scripting (XSS)
 */
export const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitizes and trims user input string
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  // Remove control characters except standard whitespace
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
};
