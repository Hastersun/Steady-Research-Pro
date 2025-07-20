// 简易依赖注入框架
/**
 * 依赖容器
 */
class Container {
  constructor() {
    this.services = new Map();
    this.factories = new Map(); // 用于懒加载服务
  }
  /**
   * 注册懒加载服务
   * @param {string} name
   * @param {Function} factory
   * @param {object} [options]
   * @param {boolean} [options.override=false]
   */
  registerLazy(name, factory, options = {}) {
    if (typeof name !== 'string' || !name) {
      throw new Error('服务名必须为非空字符串');
    }
    if (typeof factory !== 'function') {
      throw new Error('factory 必须为函数');
    }
    if (!options.override && (this.services.has(name) || this.factories.has(name))) {
      throw new Error(`服务 '${name}' 已注册。若需覆盖请设置 override=true`);
    }
    this.factories.set(name, factory);
    this.services.delete(name); // 保证懒加载覆盖
  }

  /**
   * 注册服务
   * @param {string} name
   * @param {any} instance
   * @param {object} [options]
   * @param {boolean} [options.override=false] 是否允许覆盖已注册服务
   */
  register(name, instance, options = {}) {
    if (typeof name !== 'string' || !name) {
      throw new Error('服务名必须为非空字符串');
    }
    if (!options.override && this.services.has(name)) {
      throw new Error(`服务 '${name}' 已注册。若需覆盖请设置 override=true`);
    }
    this.services.set(name, instance);
  }

  /**
   * 获取服务
   * @param {string} name
   * @returns {any}
   */
  /**
   * 获取服务（支持懒加载和异步 factory）
   * @param {string} name
   * @returns {any|Promise<any>}
   */
  get(name) {
    if (this.services.has(name)) {
      return this.services.get(name);
    }
    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      let instance;
      try {
        instance = factory();
      } catch (err) {
        throw new Error(`懒加载服务 '${name}' factory 执行失败: ${err.message}`);
      }
      if (instance instanceof Promise) {
        // 异步懒加载
        return instance.then(res => {
          this.services.set(name, res);
          this.factories.delete(name);
          return res;
        });
      } else {
        this.services.set(name, instance);
        this.factories.delete(name);
        return instance;
      }
    }
    throw new Error(`服务 '${name}' 未注册`);
  }
  /**
   * 判断服务是否已注册
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name) || this.factories.has(name);
  }
  /**
   * 移除服务
   * @param {string} name
   */
  remove(name) {
    this.services.delete(name);
    this.factories.delete(name);
  }

  /**
   * 清空所有服务
   */
  clear() {
    this.services.clear();
    this.factories.clear();
  }

  /**
   * 动态注入外部服务（如 LLM）
   * @param {string} name
   * @param {Function} factory
   * @param {object} [options]
   * @returns {any}
   */
  async inject(name, factory, options = {}) {
    if (typeof factory !== 'function') {
      throw new Error('factory 必须为函数');
    }
    try {
      const instance = await factory();
      this.register(name, instance, options);
      return instance;
    } catch (err) {
      throw new Error(`注入服务 '${name}' 失败: ${err.message}`);
    }
  }
}

module.exports = { Container };
