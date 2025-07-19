// 简易依赖注入框架
/**
 * 依赖容器
 */
class Container {
  constructor() {
    this.services = new Map();
  }

  /**
   * 注册服务
   * @param {string} name
   * @param {any} instance
   */
  register(name, instance) {
    this.services.set(name, instance);
  }

  /**
   * 获取服务
   * @param {string} name
   * @returns {any}
   */
  get(name) {
    return this.services.get(name);
  }

  /**
   * 动态注入外部服务（如 LLM）
   * @param {string} name
   * @param {Function} factory
   * @returns {any}
   */
  async inject(name, factory) {
    const instance = await factory();
    this.register(name, instance);
    return instance;
  }
}

module.exports = { Container };
