// 简单去重和长度限制，增强鲁棒性
function optimizeContext(structured, maxLength = 2048) {
  if (!Array.isArray(structured)) return [];
  if (typeof maxLength !== 'number' || maxLength <= 0) maxLength = 2048;
  try {
    const unique = Array.from(new Set(structured.filter(item => typeof item === 'string')));
    return unique.slice(-maxLength);
  } catch (err) {
    return [];
  }
}
module.exports = { optimizeContext };
