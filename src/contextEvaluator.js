// 简单评估：统计token数量，增强鲁棒性
function evaluateContext(input) {
  if (typeof input !== 'string') return { tokenCount: 0 };
  try {
    return { tokenCount: input.length };
  } catch (err) {
    return { tokenCount: 0 };
  }
}
module.exports = { evaluateContext };
