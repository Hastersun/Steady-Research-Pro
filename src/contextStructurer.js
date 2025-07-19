// 分类、分块、排序，增强鲁棒性
function structureContext(context) {
  if (!context || typeof context !== 'object') {
    return [];
  }
  const history = Array.isArray(context.history) ? context.history : [];
  const docs = Array.isArray(context.docs) ? context.docs : [];
  const userInput = typeof context.userInput === 'string' ? context.userInput : '';
  try {
    return [
      ...history,
      ...docs,
      userInput
    ];
  } catch (err) {
    return [];
  }
}
module.exports = { structureContext };
