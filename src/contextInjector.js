// 拼接为模型输入，增强鲁棒性
function injectContext(optimized) {
  if (!Array.isArray(optimized)) return '';
  try {
    return optimized.filter(item => typeof item === 'string').join('\n---\n');
  } catch (err) {
    return '';
  }
}
module.exports = { injectContext };
