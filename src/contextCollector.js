// 采集上下文信息，增强鲁棒性
function collectContext(input) {
  if (!input || typeof input !== 'object') {
    return {
      userInput: '',
      history: [],
      docs: []
    };
  }
  let { userInput, history, docs } = input;
  if (typeof userInput !== 'string') userInput = '';
  if (!Array.isArray(history)) history = [];
  if (!Array.isArray(docs)) docs = [];
  return {
    userInput,
    history,
    docs
  };
}
module.exports = { collectContext };
