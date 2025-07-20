// Prompt Loader: parse .pl file and replace variables
const fs = require('fs');

/**
 * Parse prompt from .pl file
 * @param {string} filePath - path to .pl file
 * @returns {string} prompt content
 */
function loadPrompt(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File not found: ' + filePath);
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Replace variables in prompt
 * @param {string} prompt - prompt template
 * @param {object} vars - key-value pairs for replacement
 * @returns {string} replaced prompt
 */
function replaceVars(prompt, vars = {}) {
  if (typeof prompt !== 'string') return '';
  return prompt.replace(/\*\[(\w+)\]/g, (m, key) =>
    vars.hasOwnProperty(key) ? vars[key] : m
  );
}

module.exports = { loadPrompt, replaceVars };
