// 标准化数据格式模块
/**
 * 标准化的上下文数据结构
 * @typedef {Object} ContextData
 * @property {string} id - 唯一标识
 * @property {string} type - 上下文类型
 * @property {object} payload - 具体内容
 */

/**
 * 创建新的上下文数据
 * @param {string} id
 * @param {string} type
 * @param {object} payload
 * @returns {ContextData}
 */

/**
 * 深度克隆对象，防止引用污染
 * @param {object} obj
 * @returns {object}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 创建新的上下文数据，自动生成唯一ID（如未提供），深度克隆payload
 * @param {string} [id]
 * @param {string} type
 * @param {object} payload
 * @returns {ContextData}
 */
function createContextData(id, type, payload) {
  if (typeof type !== 'string' || !type) throw new Error('type 必须为非空字符串');
  if (typeof payload !== 'object' || payload === null) throw new Error('payload 必须为对象');
  const uuid = id && typeof id === 'string' ? id : (
    'ctx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)
  );
  return { id: uuid, type, payload: deepClone(payload) };
}

/**
 * 校验数据结构是否符合标准
 * @param {object} data
 * @returns {boolean}
 */

/**
 * 深度校验 ContextData 结构和内容
 * @param {object} data
 * @returns {boolean}
 */
function validateContextData(data) {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.id !== 'string' || !/^ctx_\w+/.test(data.id)) return false;
  if (typeof data.type !== 'string' || !data.type) return false;
  if (typeof data.payload !== 'object' || data.payload === null) return false;
  // 检查 payload 不包含函数和循环引用
  try {
    JSON.stringify(data.payload);
  } catch {
    return false;
  }
  // 检查 payload 不包含函数属性
  for (const k in data.payload) {
    if (typeof data.payload[k] === 'function') return false;
  }
  return true;
}

module.exports = { createContextData, validateContextData };
