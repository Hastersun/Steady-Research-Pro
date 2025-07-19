const { collectContext } = require('./contextCollector');
const { structureContext } = require('./contextStructurer');
const { optimizeContext } = require('./contextOptimizer');
const { injectContext } = require('./contextInjector');
const { evaluateContext } = require('./contextEvaluator');

const { callOpenAI } = require('./aiModel');

function main() {
  try {
    // 示例数据
    const context = collectContext({
      userInput: '请帮我总结一下最新的AI趋势。',
      history: ['你好', '请介绍一下AI'],
      docs: ['AI正在快速发展，尤其是大模型领域。']
    });

    if (!context || typeof context !== 'object') {
      throw new Error('采集上下文失败');
    }

    const structured = structureContext(context);
    if (!Array.isArray(structured)) {
      throw new Error('结构化上下文失败');
    }

    const optimized = optimizeContext(structured, 3);
    if (!Array.isArray(optimized)) {
      throw new Error('优化上下文失败');
    }

    const injected = injectContext(optimized);
    if (typeof injected !== 'string') {
      throw new Error('注入上下文失败');
    }

    const evaluation = evaluateContext(injected);
    if (!evaluation || typeof evaluation !== 'object') {
      throw new Error('评估上下文失败');
    }

    console.log('最终上下文：', injected);
    console.log('评估结果：', evaluation);

    // AI模型调用
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      console.warn('未设置 OpenAI API Key，跳过AI模型调用。');
      return;
    }
    callOpenAI(injected, apiKey)
      .then(response => {
        console.log('AI模型回复：', response);
      })
      .catch(err => {
        console.error('AI模型调用失败：', err.message);
      });
  } catch (err) {
    console.error('运行出错：', err.message);
  }
}

main();
