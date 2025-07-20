
const COMPLEXITY_TYPE_REG = {
  summary: /summary|abstract|conclusion/,
  generation: /generate|writing|creation|story|novel/
};
const COMPLEXITY_KEYWORD_REG = /multi-step|reasoning|complex|analysis/;
const COMPLEXITY_TYPE_MAP = { summary: 1.0, qa: 1.2, generation: 1.5 };
const BASE_TOKENS = 512;

/**
 * Estimate LLM inference complexity coefficient (performance optimized)
 * @param {string} prompt - input prompt
 * @param {number} inputTokens - input token count
 * @param {number} outputTokens - estimated output token count
 * @returns {number} complexity coefficient
 */
function estimateComplexity(prompt, inputTokens, outputTokens) {
  if (typeof prompt !== 'string' || inputTokens + outputTokens <= 0) return 1;

  // Type detection
  let type = 'qa';
  if (COMPLEXITY_TYPE_REG.summary.test(prompt)) type = 'summary';
  else if (COMPLEXITY_TYPE_REG.generation.test(prompt)) type = 'generation';

  // Type coefficient lookup
  let typeCoef = COMPLEXITY_TYPE_MAP[type];

  // Complexity keyword weighting
  if (COMPLEXITY_KEYWORD_REG.test(prompt)) typeCoef *= 1.2;

  // Complexity formula
  const totalTokens = inputTokens + outputTokens;
  const complexity = (totalTokens / BASE_TOKENS) * typeCoef;

  return Math.max(1, complexity);
}
/**
 * Calculate LLM inference cost (token consumption, integrated complexity coefficient)
 * @param {string} prompt - LLM input prompt
 * @param {number} [complexity=1] - complexity coefficient (e.g. model/task complexity, default 1)
 * @returns {number} cost (total token consumption * complexity coefficient)
 */
function costCal(prompt, complexity = 1) {
  const inputTokens = countTokens(prompt);
  const outputTokens = predictOutputLength(prompt, inputTokens);
  // Cost is defined as (input token + estimated output token) * complexity coefficient
  return (inputTokens + outputTokens) * complexity;
}
/**
 * Predict LLM output token length (performance optimized)
 * @param {string} prompt - LLM input prompt
 * @param {number} inputTokens - input prompt token count
 * @returns {number} estimated output token length
 */
function predictOutputLength(prompt, inputTokens) {
  // Boundary check
  if (typeof prompt !== 'string' || inputTokens <= 0) return 1;

  // Precompiled regex
  const typeReg = {
    summary: /summary|abstract|conclusion/,
    generation: /generate|writing|creation|story|novel/
  };

  // Prompt type detection
  let type = 'qa';
  if (typeReg.summary.test(prompt)) type = 'summary';
  else if (typeReg.generation.test(prompt)) type = 'generation';

  // Ratio lookup
  const ratioMap = { summary: 0.5, qa: 1, generation: 1.5 };
  let ratio = ratioMap[type];

  // Dynamic adjustment
  if (inputTokens < 50) ratio += 0.5;
  else if (inputTokens > 500) ratio -= 0.3;

  // Estimate output length
  const MODEL_MAX_TOKENS = 2048;
  let outputLength = Math.floor(inputTokens * ratio);
  outputLength = Math.min(outputLength, MODEL_MAX_TOKENS - inputTokens);

  return Math.max(1, outputLength);
}
/**
 * Count LLM prompt token number (basic implementation: split by space and punctuation)
 * @param {string} prompt
 * @returns {number} token count
 */
function countTokens(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) return 0;
  // English: split by space and punctuation; Chinese: count each character
  // Replace with actual LLM tokenizer if needed
  const isChinese = /[\u4e00-\u9fa5]/.test(prompt);
  if (isChinese) {
    return prompt.replace(/\s/g, '').length;
  } else {
    return prompt.split(/\s+|[.,!?;:]/).filter(Boolean).length;
  }
}
// Planning Layer
// Task decomposition and shortest path planning

/**
 * Split a complex task into multiple simple tasks
 * @param {string} task - complex task description
 * @returns {string[]} simple task list
 */
function splitTask(task) {
  // Auto detect <workflow> as start and </workflow> as end, only process content inside
  if (typeof task !== 'string' || !task.trim()) return [];
  const match = task.match(/<workflow>([\s\S]*?)<\/workflow>/i);
  const content = match ? match[1].trim() : task.trim();
  return content.split(/#@/).map(t => t.trim()).filter(Boolean);
}

/**
 * Plan the shortest path (lightweight implementation)
 * @param {Array<{from: string, to: string, cost: number}>} edges - edge list
 * @param {string} start - start node
 * @param {string} end - end node
 * @returns {string[]} shortest path node list
 */
function planShortestPath(edges, start, end) {
  // Lightweight Dijkstra algorithm
  const nodes = new Set();
  edges.forEach(e => { nodes.add(e.from); nodes.add(e.to); });
  const dist = {}, prev = {};
  nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[start] = 0;
  const visited = new Set();
  while (visited.size < nodes.size) {
    let u = null;
    let minDist = Infinity;
    nodes.forEach(n => {
      if (!visited.has(n) && dist[n] < minDist) {
        minDist = dist[n];
        u = n;
      }
    });
    if (u === null) break;
    visited.add(u);
    edges.filter(e => e.from === u).forEach(e => {
      if (dist[e.to] > dist[u] + e.cost) {
        dist[e.to] = dist[u] + e.cost;
        prev[e.to] = u;
      }
    });
  }
  // Backtrack path
  const path = [];
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }
  if (path[0] !== start) return []; // No path
  return path;
}

module.exports = { splitTask, planShortestPath, countTokens, predictOutputLength, costCal, estimateComplexity };
