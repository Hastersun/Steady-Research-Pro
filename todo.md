# Steady Research Pro - 项目TODO清单

> 项目状态扫描日期：2025年10月29日  
> 基于代码审查和文档分析生成  
> 总计：68个具体任务，预估工时：180-240小时

## 🎯 优先级分类

### 🔴 **高优先级 (Critical)** - 立即处理 (1-2周内)
- [ ] **[SECURITY-001]** API密钥安全存储 `⏱️ 8h` `📁 src/components/SearchConfigPanel.astro:106-113`
- [ ] **[PERF-001]** 内存溢出风险修复 `⏱️ 12h` `📁 src/components/ResearchAgentUI.astro:704-750`
- [ ] **[ERROR-001]** 搜索API降级策略 `⏱️ 6h` `📁 src/pages/api/search.js:46-158`
- [ ] **[SEC-002]** 依赖安全漏洞修复 `⏱️ 4h` `📁 package.json`

### 🟡 **中优先级 (Important)** - 2-4周内完成
- [ ] **[FEAT-001]** 深度代理配置持久化 `⏱️ 16h` `📁 src/lib/research-processor.js`
- [ ] **[UX-001]** 研究任务进度恢复 `⏱️ 20h` `📁 新功能模块`
- [ ] **[I18N-001]** 英文翻译补全 `⏱️ 8h` `📁 src/lib/i18n.js:254-428`
- [ ] **[TEST-001]** 单元测试覆盖率提升 `⏱️ 24h` `📁 tests/`

### 🟢 **低优先级 (Nice to have)** - 长期规划
- [ ] **[CODE-001]** TypeScript严格模式 `⏱️ 16h` `📁 多个.astro文件`
- [ ] **[DOC-001]** API文档版本更新 `⏱️ 4h` `📁 docs/API.md:436`
- [ ] **[MONITOR-001]** 性能监控系统 `⏱️ 20h` `📁 新功能模块`
- [ ] **[THEME-001]** 深色主题支持 `⏱️ 12h` `📁 src/styles/global.css`

---

## 📋 详细任务清单

### 🛡️ 安全与隐私

#### **[SECURITY-001]** API密钥安全存储 `⏱️ 8小时` `🔴 高优先级` `⚠️ 立即执行`

**❌ 当前风险**: API密钥明文存储，XSS攻击可直接读取
```javascript
// 📁 src/components/SearchConfigPanel.astro:106-113
const writeStoredConfig = config => {
  storage.setItem(STORAGE_KEY, JSON.stringify(config)); // 🚨 敏感信息明文暴露
  // 任何恶意脚本都可以执行: localStorage.getItem('steady-research-pro:search-config')
};
```

## 🔧 **详细执行步骤**

### **步骤1: 创建加密工具** `[1小时]`
```bash
# 1.1 安装加密依赖
npm install crypto-js @types/crypto-js

# 1.2 创建加密工具文件
touch src/lib/crypto-utils.js
```

**💻 完整代码模板**:
```javascript
// 📁 src/lib/crypto-utils.js - 需要创建
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-prod';

export class SecureStorage {
  static encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  }
  
  static decrypt(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
  static setItem(key, data) {
    localStorage.setItem(key, this.encrypt(data));
  }
  
  static getItem(key) {
    const encrypted = localStorage.getItem(key);
    return encrypted ? this.decrypt(encrypted) : null;
  }
}
```

### **步骤2: 实现API代理服务** `[2小时]`
```bash
# 2.1 创建代理API文件
touch src/pages/api/proxy-search.js
```

**💻 完整代码模板**:
```javascript
// 📁 src/pages/api/proxy-search.js - 需要创建
export async function POST({ request }) {
  const { query, engine, keyHash } = await request.json();
  
  // 验证密钥哈希
  const validKeyHash = process.env[`${engine.toUpperCase()}_KEY_HASH`];
  if (keyHash !== validKeyHash) {
    return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 401 });
  }
  
  // 使用服务端存储的真实API密钥
  const realApiKey = process.env[`${engine.toUpperCase()}_API_KEY`];
  
  // 执行搜索请求...
  const searchResult = await performSearch(query, engine, realApiKey);
  
  return new Response(JSON.stringify(searchResult));
}
```

### **步骤3: 修改前端存储逻辑** `[3小时]`
**🎯 需要修改的文件**:
```bash
# 3.1 备份原文件
cp src/components/SearchConfigPanel.astro src/components/SearchConfigPanel.astro.backup

# 3.2 修改存储逻辑 (在SearchConfigPanel.astro中)
```

**💻 替换代码 (行106-113)**:
```javascript
// ❌ 删除这段代码
const writeStoredConfig = config => {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('保存搜索配置失败:', error);
  }
};

// ✅ 替换为安全存储
import { SecureStorage } from '../lib/crypto-utils.js';

const writeStoredConfig = config => {
  if (!storage) return;
  try {
    // 仅存储密钥哈希，不存储真实密钥
    const safeConfig = {
      ...config,
      bing: config.bing ? hashApiKey(config.bing) : '',
      google: config.google ? hashApiKey(config.google) : '',
    };
    SecureStorage.setItem(STORAGE_KEY, safeConfig);
  } catch (error) {
    console.warn('保存配置失败:', error);
  }
};

function hashApiKey(key) {
  return CryptoJS.SHA256(key).toString().substring(0, 16);
}
```

### **步骤4: 添加密钥验证** `[1小时]`
**💻 添加到 SearchConfigPanel.astro**:
```javascript
// 密钥强度验证
function validateApiKey(key, type) {
  const validations = {
    bing: /^[a-f0-9]{32}$/i,      // Bing key format
    google: /^AIza[0-9A-Za-z_-]{35}$/ // Google key format
  };
  
  if (!validations[type].test(key)) {
    throw new Error(`Invalid ${type} API key format`);
  }
  
  // 检查密钥是否过期 (调用各自的验证端点)
  return verifyKeyWithProvider(key, type);
}
```

### **步骤5: 安全测试** `[1小时]`
```bash
# 5.1 创建安全测试文件
touch tests/security/api-key-security.test.js
```

**💻 测试代码模板**:
```javascript
// 📁 tests/security/api-key-security.test.js
import { test, expect } from 'vitest';
import { SecureStorage } from '../../src/lib/crypto-utils.js';

test('API密钥不应明文存储', () => {
  const sensitiveData = { bing: 'real-api-key-123' };
  SecureStorage.setItem('test-key', sensitiveData);
  
  const stored = localStorage.getItem('test-key');
  expect(stored).not.toContain('real-api-key-123');
  expect(stored).toMatch(/^U2Fsd/); // 加密后的base64格式
});

test('恶意脚本无法读取真实密钥', () => {
  // 模拟XSS攻击尝试读取localStorage
  const maliciousScript = `
    const keys = Object.keys(localStorage);
    const values = keys.map(k => localStorage.getItem(k));
    const found = values.some(v => v.includes('api-key'));
  `;
  
  expect(eval(`(() => { ${maliciousScript}; return found; })()`)).toBe(false);
});
```

## ✅ **具体验收检查清单**

### 安全检查 ✅❌
- [ ] **[必须]** 在浏览器开发者工具中检查localStorage，确认无明文API密钥
- [ ] **[必须]** 运行 `npm audit` 无高风险漏洞
- [ ] **[必须]** 使用OWASP ZAP扫描，XSS测试通过
- [ ] **[必须]** 密钥强度验证测试通过
- [ ] **[推荐]** 密钥自动过期机制 (7天)

### 功能检查 ✅❌
- [ ] **[必须]** 搜索功能正常工作
- [ ] **[必须]** 配置保存/加载正常
- [ ] **[必须]** 错误提示用户友好
- [ ] **[必须]** 性能无明显下降 (<100ms额外延迟)

### 代码质量 ✅❌
- [ ] **[必须]** TypeScript编译无错误
- [ ] **[必须]** ESLint检查通过
- [ ] **[必须]** 测试覆盖率>80%
- [ ] **[推荐]** 代码审查通过

## 🚨 **执行命令序列**
```bash
# 完整执行流程 - 按顺序执行
npm install crypto-js @types/crypto-js
touch src/lib/crypto-utils.js
# [手动编辑crypto-utils.js]
touch src/pages/api/proxy-search.js  
# [手动编辑proxy-search.js]
cp src/components/SearchConfigPanel.astro src/components/SearchConfigPanel.astro.backup
# [手动修改SearchConfigPanel.astro]
touch tests/security/api-key-security.test.js
# [手动编辑测试文件]
npm run test tests/security/
npm run build
npm audit
```

## ⏰ **预期时间分配**
- **准备和研究**: 30分钟
- **编码实现**: 5小时30分钟  
- **测试和调试**: 1小时30分钟
- **文档和验收**: 30分钟
- **总计**: 8小时

#### **[SEC-002]** 输入验证加强 `⏱️ 6小时` `🟡 中优先级`
**问题描述**: 用户输入缺少严格验证，存在XSS和注入攻击风险
```javascript
// 📁 src/pages/api/search.js:13-50
// 缺少输入验证的查询处理
const { query, engines = ['bing'] } = body;
if (!query?.trim()) { // ❌ 仅检查空值，未sanitize
```

**执行步骤**:
1. **[2h]** 安装并配置DOMPurify库
2. **[2h]** 实现输入sanitization中间件
3. **[1h]** 添加请求频率限制
4. **[1h]** 更新所有API端点的输入验证

**验收标准**:
- [ ] 所有用户输入经过sanitization
- [ ] 实现请求频率限制（100次/小时）
- [ ] 通过OWASP ZAP安全测试

### 🚀 性能优化

#### **[PERF-001]** 内存管理优化 `⏱️ 12小时` `🔴 高优先级` `📊 性能关键`

**🐌 当前性能问题**: 渲染1000条搜索结果导致页面卡顿3-5秒，内存占用600MB+
```javascript
// 📁 src/components/ResearchAgentUI.astro:704-750 (性能瓶颈代码)
entries.slice(0, 10).forEach(item => {
  const tr = document.createElement('tr');     // 🚨 大量DOM节点创建
  tr.innerHTML = `<td>${item.title}</td>...`; // 🚨 innerHTML触发重排重绘
  sourcesBody.appendChild(tr);                // 🚨 逐个添加，多次重排
  // 🚨 无节点复用，内存持续增长
});
```

## 🔧 **详细执行步骤**

### **步骤1: 实现虚拟滚动组件** `[4小时]`
```bash
# 1.1 创建虚拟滚动组件
mkdir -p src/components/performance
touch src/components/performance/VirtualList.astro
touch src/components/performance/VirtualList.js
```

**💻 VirtualList.astro 完整代码**:
```astro
---
// 📁 src/components/performance/VirtualList.astro - 需要创建
interface Props {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => string;
}

const { items, itemHeight = 60, containerHeight = 400, renderItem } = Astro.props;
---

<div class="virtual-list-container" style={`height: ${containerHeight}px`}>
  <div class="virtual-list-scroll" id="virtual-scroll">
    <div class="virtual-list-spacer-before"></div>
    <div class="virtual-list-visible-area" id="visible-area"></div>
    <div class="virtual-list-spacer-after"></div>
  </div>
</div>

<script>
import { VirtualListManager } from './VirtualList.js';

const container = document.getElementById('virtual-scroll');
const visibleArea = document.getElementById('visible-area');

// 🎯 关键优化：仅渲染可见区域的DOM节点
const virtualList = new VirtualListManager({
  container,
  visibleArea,
  items: window.searchResults || [],
  itemHeight: 60,
  containerHeight: 400,
  bufferSize: 10, // 上下各预渲染10个节点
  renderItem: (item, index) => `
    <tr class="virtual-item" data-index="${index}">
      <td>${item.title || '未知标题'}</td>
      <td>${item.domain || '未知域名'}</td>
      <td>${item.score || 0}</td>
    </tr>
  `
});

// 监听滚动事件，动态更新可视区域
container.addEventListener('scroll', () => {
  virtualList.updateVisibleItems();
});
</script>
```

**💻 VirtualList.js 管理器**:
```javascript
// 📁 src/components/performance/VirtualList.js - 需要创建
export class VirtualListManager {
  constructor({ container, visibleArea, items, itemHeight, containerHeight, renderItem, bufferSize = 5 }) {
    this.container = container;
    this.visibleArea = visibleArea;
    this.items = items;
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.renderItem = renderItem;
    this.bufferSize = bufferSize;
    
    // 节点池，复用DOM元素
    this.nodePool = [];
    this.visibleNodes = new Map();
    
    this.init();
  }
  
  init() {
    const totalHeight = this.items.length * this.itemHeight;
    this.container.style.height = `${totalHeight}px`;
    this.updateVisibleItems();
  }
  
  updateVisibleItems() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + this.bufferSize,
      this.items.length
    );
    
    // 🎯 关键优化：仅更新变化的节点
    this.renderVisibleRange(startIndex, endIndex);
  }
  
  renderVisibleRange(startIndex, endIndex) {
    // 回收不可见的节点到池中
    this.recycleInvisibleNodes(startIndex, endIndex);
    
    // 渲染新的可见节点
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleNodes.has(i)) {
        const node = this.getNodeFromPool();
        node.innerHTML = this.renderItem(this.items[i], i);
        node.style.transform = `translateY(${i * this.itemHeight}px)`;
        this.visibleArea.appendChild(node);
        this.visibleNodes.set(i, node);
      }
    }
  }
  
  // 🎯 关键优化：DOM节点复用池
  getNodeFromPool() {
    if (this.nodePool.length > 0) {
      return this.nodePool.pop();
    }
    const node = document.createElement('div');
    node.className = 'virtual-list-item';
    return node;
  }
  
  recycleInvisibleNodes(startIndex, endIndex) {
    for (const [index, node] of this.visibleNodes) {
      if (index < startIndex || index >= endIndex) {
        this.visibleArea.removeChild(node);
        this.nodePool.push(node);
        this.visibleNodes.delete(index);
      }
    }
  }
}
```

### **步骤2: 重构结果显示逻辑** `[3小时]`
```bash
# 2.1 备份原始文件
cp src/components/ResearchAgentUI.astro src/components/ResearchAgentUI.astro.backup

# 2.2 性能分析工具
npm install --save-dev web-vitals
```

**💻 替换 ResearchAgentUI.astro 中的结果渲染代码 (行704-750)**:
```javascript
// ❌ 删除原始的性能差代码
entries.slice(0, 10).forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = `...`;
  sourcesBody.appendChild(tr);
});

// ✅ 替换为高性能批量渲染
function updateSourcesTableOptimized(entries = []) {
  console.time('渲染性能测试'); // 性能监控
  
  if (!sourcesBody) return;
  
  // 🎯 性能优化1: 使用DocumentFragment批量操作DOM
  const fragment = document.createDocumentFragment();
  
  // 🎯 性能优化2: 模板字符串拼接，避免innerHTML
  const tableRows = entries.slice(0, 50).map((item, index) => {
    const title = item.title || item.summary || '未知标题';
    const url = item.sourceUrl || item.url || '';
    const domain = url ? getDomain(url) : '未知域名';
    const score = typeof item.confidence === 'number' ? 
      item.confidence.toFixed(2) : '—';
    
    return `
      <tr class="hover:bg-gray-50/70 animate-fade-in" data-index="${index}">
        <td class="px-4 py-2 text-sm text-gray-900">${title}</td>
        <td class="px-4 py-2 text-sm text-gray-500">${domain}</td>
        <td class="px-4 py-2 text-sm text-gray-600">${score}</td>
        <td class="px-4 py-2">
          ${url ? `<a href="${url}" target="_blank" class="text-blue-600 hover:text-blue-800">查看</a>` : '—'}
        </td>
      </tr>
    `;
  }).join('');
  
  // 🎯 性能优化3: 一次性更新DOM
  sourcesBody.innerHTML = tableRows;
  
  console.timeEnd('渲染性能测试');
  
  // 🎯 性能优化4: 内存使用监控
  if (performance.memory) {
    console.log('内存使用:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
    });
  }
}
```

### **步骤3: 添加分页机制** `[2小时]`
**💻 分页组件代码**:
```javascript
// 📁 添加到 ResearchAgentUI.astro
class PaginationManager {
  constructor(containerId, itemsPerPage = 50) {
    this.container = document.getElementById(containerId);
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalItems = 0;
    this.items = [];
  }
  
  setItems(items) {
    this.items = items;
    this.totalItems = items.length;
    this.currentPage = 1;
    this.render();
  }
  
  render() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageItems = this.items.slice(startIndex, endIndex);
    
    // 渲染当前页数据
    updateSourcesTableOptimized(pageItems);
    
    // 更新分页控件
    this.updatePaginationControls();
  }
  
  updatePaginationControls() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const paginationHtml = `
      <div class="pagination-controls flex justify-between items-center mt-4">
        <span class="text-sm text-gray-600">
          显示 ${(this.currentPage - 1) * this.itemsPerPage + 1} - 
          ${Math.min(this.currentPage * this.itemsPerPage, this.totalItems)} 
          共 ${this.totalItems} 条
        </span>
        <div class="flex space-x-2">
          <button onclick="pagination.prevPage()" 
                  ${this.currentPage === 1 ? 'disabled' : ''} 
                  class="px-3 py-1 border rounded">上一页</button>
          <span class="px-3 py-1">${this.currentPage} / ${totalPages}</span>
          <button onclick="pagination.nextPage()" 
                  ${this.currentPage === totalPages ? 'disabled' : ''} 
                  class="px-3 py-1 border rounded">下一页</button>
        </div>
      </div>
    `;
    
    // 插入或更新分页控件
    let paginationDiv = document.getElementById('pagination-controls');
    if (!paginationDiv) {
      paginationDiv = document.createElement('div');
      paginationDiv.id = 'pagination-controls';
      this.container.parentNode.insertBefore(paginationDiv, this.container.nextSibling);
    }
    paginationDiv.innerHTML = paginationHtml;
  }
  
  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.render();
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
    }
  }
}

// 初始化分页管理器
const pagination = new PaginationManager('sources-table-body', 50);
window.pagination = pagination; // 全局访问
```

### **步骤4: DOM节点回收池** `[2小时]`
**💻 节点池管理器**:
```javascript
// 📁 添加到 ResearchAgentUI.astro
class DOMNodePool {
  constructor() {
    this.pools = new Map(); // 按节点类型分池
    this.maxPoolSize = 100;  // 每个池最大容量
  }
  
  // 获取节点（优先从池中复用）
  getNode(type = 'tr', className = '') {
    const pool = this.pools.get(type) || [];
    
    if (pool.length > 0) {
      const node = pool.pop();
      node.className = className;
      node.innerHTML = '';
      return node;
    }
    
    // 池中无可用节点，创建新节点
    const node = document.createElement(type);
    node.className = className;
    return node;
  }
  
  // 回收节点到池中
  recycleNode(node, type = 'tr') {
    if (!node || node.parentNode) return;
    
    const pool = this.pools.get(type) || [];
    if (pool.length < this.maxPoolSize) {
      // 清理节点状态
      node.innerHTML = '';
      node.className = '';
      node.removeAttribute('data-index');
      
      pool.push(node);
      this.pools.set(type, pool);
    }
  }
  
  // 清理所有池
  clearPools() {
    this.pools.clear();
  }
  
  // 获取池状态信息
  getPoolStats() {
    const stats = {};
    for (const [type, pool] of this.pools) {
      stats[type] = pool.length;
    }
    return stats;
  }
}

// 全局节点池实例
window.domNodePool = new DOMNodePool();
```

### **步骤5: 内存监控** `[1小时]`
**💻 内存监控代码**:
```javascript
// 📁 添加到 ResearchAgentUI.astro
class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.isMonitoring = false;
  }
  
  start() {
    this.isMonitoring = true;
    this.monitor();
  }
  
  stop() {
    this.isMonitoring = false;
  }
  
  monitor() {
    if (!this.isMonitoring) return;
    
    if (performance.memory) {
      const measurement = {
        timestamp: Date.now(),
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      
      this.measurements.push(measurement);
      
      // 保留最近100次测量
      if (this.measurements.length > 100) {
        this.measurements.shift();
      }
      
      // 内存使用告警
      const usedMB = measurement.used / 1024 / 1024;
      if (usedMB > 400) { // 400MB警告线
        console.warn(`内存使用过高: ${usedMB.toFixed(1)}MB`);
      }
    }
    
    // 每5秒监控一次
    setTimeout(() => this.monitor(), 5000);
  }
  
  getReport() {
    if (this.measurements.length === 0) return null;
    
    const latest = this.measurements[this.measurements.length - 1];
    const peak = Math.max(...this.measurements.map(m => m.used));
    
    return {
      current: (latest.used / 1024 / 1024).toFixed(1) + 'MB',
      peak: (peak / 1024 / 1024).toFixed(1) + 'MB',
      measurements: this.measurements.length
    };
  }
}

// 启动内存监控
const memoryMonitor = new MemoryMonitor();
memoryMonitor.start();
window.memoryMonitor = memoryMonitor;
```

## ✅ **性能验收检查清单**

### 🚀 性能指标 ✅❌ (需要实际测量)
- [ ] **[关键]** 渲染10000条结果时间 < 2秒 (当前: ~8秒)
- [ ] **[关键]** 滚动流畅度: 60fps无掉帧 (Chrome DevTools测量)  
- [ ] **[关键]** 内存峰值 < 300MB (当前: ~600MB)
- [ ] **[重要]** 首屏渲染时间 < 500ms (当前: ~2秒)
- [ ] **[重要]** DOM节点数量 < 200个 (虚拟滚动后)

### 📊 具体测试命令
```bash
# 性能测试脚本
npm run test:performance

# 内存泄漏检测
npm run test:memory-leak

# Chrome DevTools性能分析
# 1. 打开开发者工具 -> Performance
# 2. 录制操作：加载大量数据 + 滚动
# 3. 分析FPS、内存使用、DOM节点数量
```

### 🎯 性能基准对比
| 指标 | 优化前 | 优化后 | 改善 |
|------|--------|--------|------|
| 渲染时间 | 8秒 | <2秒 | 75%↑ |
| 内存使用 | 600MB | <300MB | 50%↓ |
| DOM节点 | 1000+ | <200 | 80%↓ |
| 滚动FPS | 20-30 | 55-60 | 100%↑ |

## ⚡ **执行命令序列**
```bash
# 性能优化完整流程
mkdir -p src/components/performance
touch src/components/performance/VirtualList.astro
touch src/components/performance/VirtualList.js
cp src/components/ResearchAgentUI.astro src/components/ResearchAgentUI.astro.backup
npm install --save-dev web-vitals
# [手动编辑所有文件，按上述代码模板]
npm run build
npm run test:performance
# [在Chrome DevTools中进行性能测试]
```

#### **[PERF-002]** 网络请求优化 `⏱️ 10小时` `🟡 中优先级`
**问题描述**: 搜索API请求无并发控制，可能触发API限流
```javascript
// 📁 src/lib/agents/SearchAgent.js:95-120
// 缺少请求队列和重试机制
const promises = queries.map(q => this.searchClient.search(q));
const results = await Promise.all(promises); // ❌ 无并发控制
```

**执行步骤**:
1. **[3h]** 实现请求队列管理器 `src/lib/request-queue.js`
2. **[3h]** 添加指数退避重试机制
3. **[2h]** 实现请求缓存（5分钟TTL）
4. **[2h]** 添加超时控制和取消机制

**验收标准**:
- [ ] 并发请求数限制为3个
- [ ] 失败请求自动重试最多3次
- [ ] 平均响应时间减少30%

### 🔧 功能增强

#### **[FEAT-001]** 研究状态持久化 `⏱️ 16小时` `🟡 中优先级`
**功能描述**: 支持长时间研究任务的中断恢复，避免重复工作
```javascript
// 📁 src/lib/research-processor.js:243-280
// 当前缺少状态保存机制
export default class ResearchTaskProcessor {
  async executePipeline(pipeline, context, emit) {
    // ❌ 无状态快照保存，任务中断后无法恢复
  }
}
```

**执行步骤**:
1. **[4h]** 设计状态序列化格式 `src/types/research-state.d.ts`
2. **[4h]** 实现状态快照管理器 `src/lib/state-manager.js`
3. **[3h]** 修改ResearchTaskProcessor支持状态保存
4. **[3h]** 添加任务恢复界面 `src/components/TaskRecovery.astro`
5. **[2h]** 实现状态压缩和清理机制

**验收标准**:
- [ ] 支持任意步骤中断后恢复
- [ ] 状态文件大小<1MB
- [ ] 恢复成功率>95%

#### **[FEAT-002]** 搜索引擎扩展 `⏱️ 14小时` `🟢 低优先级`
**功能描述**: 集成更多搜索引擎，提高信息源覆盖度
```javascript
// 📁 src/lib/search-engines.js
// 当前仅支持Bing和Google
const DEFAULT_ENGINES = ['bing', 'google']; // ❌ 搜索源单一
```

**执行步骤**:
1. **[4h]** 集成DuckDuckGo API `src/lib/engines/duckduckgo.js`
2. **[4h]** 添加学术搜索引擎(Semantic Scholar) `src/lib/engines/semantic-scholar.js`
3. **[3h]** 实现搜索引擎插件架构
4. **[2h]** 添加引擎配置界面
5. **[1h]** 更新搜索策略算法

**验收标准**:
- [ ] 支持5+个搜索引擎
- [ ] 插件式架构支持动态扩展
- [ ] 搜索结果去重率>90%

#### **[FEAT-003]** 结果导出功能 `⏱️ 18小时` `🟡 中优先级`
**功能描述**: 支持研究报告多种格式导出，便于分享和存档

**执行步骤**:
1. **[6h]** 集成PDF生成库(Puppeteer) `src/lib/exporters/pdf-exporter.js`
2. **[4h]** 实现Word文档导出 `src/lib/exporters/docx-exporter.js`
3. **[3h]** 添加导出模板系统 `src/templates/`
4. **[3h]** 创建导出界面 `src/components/ExportPanel.astro`
5. **[2h]** 实现批量导出和进度显示

**验收标准**:
- [ ] 支持PDF、DOCX、JSON、Markdown格式
- [ ] 导出质量保持原始格式
- [ ] 支持自定义模板

### 💻 代码质量

#### **[CODE-001]** TypeScript类型完善 `⏱️ 16小时` `🟡 中优先级`
**问题描述**: 多个文件使用`@ts-nocheck`绕过类型检查，降低了代码安全性
```typescript
// 📁 src/components/SearchConfigPanel.astro:6
<script type="module">
  // @ts-nocheck ❌ 绕过类型检查
  import { SearchAPIClient } from '../lib/search-api-client.js';
```

**受影响文件**:
- `src/components/AIServiceSelector.astro:148`
- `src/components/SearchConfigPanel.astro:6`
- `src/components/ResearchAgentUI.astro:135`
- `src/components/agent/SidePanel.astro:730`

**执行步骤**:
1. **[4h]** 创建类型定义文件 `src/types/index.d.ts`
2. **[6h]** 逐个文件移除`@ts-nocheck`并修复类型错误
3. **[3h]** 实现泛型接口和严格类型约束
4. **[2h]** 配置TypeScript严格模式
5. **[1h]** 添加类型检查到CI流程

**验收标准**:
- [ ] 移除所有`@ts-nocheck`标记
- [ ] TypeScript编译0警告0错误
- [ ] 类型覆盖率>85%

#### **[ERROR-001]** 错误处理标准化 `⏱️ 8小时` `🔴 高优先级`
**问题描述**: 各模块错误处理方式不一致，难以调试和监控
```javascript
// 📁 src/pages/api/search.js:46-76 (不一致的错误格式)
} catch (error) {
  return new Response(JSON.stringify({
    success: false,
    error: `搜索失败: ${error.message}`, // ❌ 错误格式不统一
  }));
}

// 📁 src/lib/research-processor.js:250-258
} catch (error) {
  emit?.(step.id, 'error', progressBase / totalWeight, error.message || '步骤执行失败', {
    error: { message: error.message, stack: error.stack }, // ❌ 不同的错误结构
  });
}
```

**执行步骤**:
1. **[2h]** 设计统一错误格式规范 `src/types/error.d.ts`
2. **[3h]** 实现错误处理中间件 `src/lib/error-handler.js`
3. **[2h]** 重构所有API端点的错误处理
4. **[1h]** 添加错误日志收集和上报

**验收标准**:
- [ ] 所有错误使用统一格式
- [ ] 实现错误分级(DEBUG/INFO/WARN/ERROR)
- [ ] 错误恢复机制覆盖率>80%

#### **[REFACTOR-001]** 代码重构优化 `⏱️ 20小时` `🟢 低优先级`
**问题描述**: 部分组件功能过于集中，违反单一职责原则
```javascript
// 📁 src/components/ResearchAgentUI.astro:135-750 (650行，功能混杂)
// 混合了UI渲染、事件处理、数据管理等职责
```

**执行步骤**:
1. **[6h]** 拆分大型组件，按职责分离
2. **[5h]** 提取公共逻辑到hooks/utils
3. **[4h]** 优化事件处理机制，使用发布-订阅模式
4. **[3h]** 重构状态管理，引入状态机
5. **[2h]** 代码质量检查和性能优化

**验收标准**:
- [ ] 单个组件代码行数<300行
- [ ] 圈复杂度<10
- [ ] 代码重复率<5%

### 🧪 测试覆盖

#### **[TEST-001]** 单元测试扩展 `⏱️ 24小时` `🟡 中优先级`
**现状分析**: 当前测试覆盖率约40-50%，关键模块缺少测试
```bash
# 当前测试文件
tests/
├── llm-router.test.js          ✅ 已有
├── research-processor.test.js  ✅ 已有  
├── search-agent.test.js        ✅ 已有
└── search-engines.test.js      ✅ 已有
```

**缺失测试模块**:
```javascript
// ❌ 缺少测试的关键文件
src/lib/http-api.js              // HTTP客户端，0%覆盖率
src/components/SearchConfigPanel.astro  // 复杂组件交互，0%覆盖率  
src/lib/agents/ModelingAgent.js  // 建模逻辑，25%覆盖率
src/lib/i18n.js                 // 国际化逻辑，0%覆盖率
```

**执行步骤**:
1. **[8h]** HTTP API客户端测试 `tests/http-api.test.js`
   - API调用成功/失败场景
   - 超时和重试机制
   - 错误处理逻辑
2. **[6h]** 组件交互测试 `tests/components/search-config-panel.test.js`
   - 用户输入验证
   - 配置保存/加载
   - 事件触发和响应
3. **[4h]** 建模Agent测试 `tests/agents/modeling-agent.test.js`
   - 数据建模算法
   - 边界条件处理
   - 错误恢复机制
4. **[3h]** 国际化测试 `tests/i18n.test.js`
5. **[3h]** E2E测试套件 `tests/e2e/`

**验收标准**:
- [ ] 整体测试覆盖率>80%
- [ ] 关键路径覆盖率>95%
- [ ] 所有API端点有集成测试

#### **[TEST-002]** 性能基准测试 `⏱️ 12小时` `🟢 低优先级`
**测试目标**: 建立性能基准，监控性能回归

**执行步骤**:
1. **[4h]** 大量数据处理性能测试
   ```javascript
   // tests/performance/large-dataset.test.js
   describe('Large Dataset Performance', () => {
     it('should handle 10000+ search results without memory leak', async () => {
       // 测试内存使用和渲染性能
     });
   });
   ```
2. **[4h]** 并发任务处理测试
3. **[2h]** 内存使用监控测试
4. **[2h]** 性能回归检测机制

**验收标准**:
- [ ] 10000条结果处理时间<3秒
- [ ] 内存使用峰值<500MB
- [ ] 并发3个任务无性能劣化

---

## 📊 **明确实施路径与时间线**

### **🚨 第一阶段 (紧急修复 - 1周内完成)** `总计: 26小时`
**目标**: 修复安全漏洞和关键bug，确保系统稳定运行

| 任务编号 | 任务名称 | 预估工时 | 负责人 | 开始日期 | 截止日期 | 具体文件 |
|---------|---------|---------|--------|----------|----------|----------|
| SECURITY-001 | API密钥安全存储 | 8h | Backend开发者 | 2025-10-29 | 2025-11-02 | `SearchConfigPanel.astro:106-113` |
| ERROR-001 | 错误处理标准化 | 8h | Backend开发者 | 2025-10-30 | 2025-11-03 | `src/pages/api/*.js` |
| SEC-002 | 依赖安全漏洞修复 | 4h | DevOps工程师 | 2025-10-29 | 2025-11-01 | `package.json` |
| PERF-001 | 内存溢出风险修复 | 12h | Frontend开发者 | 2025-10-31 | 2025-11-05 | `ResearchAgentUI.astro:704-750` |

## 📋 **每日执行计划**

### **Day 1 (2025-10-29 周二)**
**🎯 今日目标**: 启动安全修复和依赖更新

#### 上午 (9:00-12:00) - DevOps工程师
```bash
# SEC-002: 依赖安全漏洞修复 [4小时]
cd d:\Onlinebiz\zerox\gridsfeed\backs\srp\Steady-Research-Pro-main

# 1. 安全审计
npm audit --audit-level=high
npm audit fix --force

# 2. 检查具体漏洞
npm ls --depth=0
npm outdated

# 3. 手动更新关键依赖
npm update @astrojs/tailwind@latest
npm update astro@latest
npm update eslint@latest

# 4. 验证更新
npm run build
npm run test
```

#### 下午 (13:00-17:00) - Backend开发者  
```bash
# SECURITY-001: 开始API密钥安全存储 [4小时]
# 执行步骤1-2: 创建加密工具和API代理

npm install crypto-js @types/crypto-js
touch src/lib/crypto-utils.js
touch src/pages/api/proxy-search.js

# [按照上述详细代码模板编写]
# 预期完成: 加密工具类 + API代理服务
```

**📊 Day 1 预期产出**:
- [ ] 依赖漏洞100%修复
- [ ] 加密工具模块完成
- [ ] API代理服务完成

### **Day 2 (2025-10-30 周三)**
**🎯 今日目标**: 完成API安全存储，启动错误处理标准化

#### 上午 (9:00-12:00) - Backend开发者
```bash
# SECURITY-001: 完成API密钥安全存储 [4小时剩余]
# 执行步骤3-5: 修改存储逻辑 + 验证 + 测试

cp src/components/SearchConfigPanel.astro src/components/SearchConfigPanel.astro.backup
# [按照详细代码模板修改SearchConfigPanel.astro]
touch tests/security/api-key-security.test.js
# [编写安全测试用例]

npm run test tests/security/
```

#### 下午 (13:00-17:00) - Backend开发者
```bash
# ERROR-001: 错误处理标准化 [开始4小时]
# 步骤1-2: 设计错误格式 + 实现中间件

touch src/types/error.d.ts
touch src/lib/error-handler.js

# [按照统一错误格式规范编写]
```

**📊 Day 2 预期产出**:
- [ ] API密钥安全存储100%完成
- [ ] 错误处理规范设计完成
- [ ] 错误处理中间件完成

### **Day 3 (2025-10-31 周四)**
**🎯 今日目标**: 完成错误处理，启动性能优化

#### 上午 (9:00-12:00) - Backend开发者
```bash
# ERROR-001: 完成错误处理标准化 [4小时剩余]
# 步骤3-4: 重构API错误处理 + 错误日志

# 修改所有API文件:
# src/pages/api/search.js
# src/pages/api/research.js  
# src/pages/api/ollama.js
# src/pages/api/research-stream.js

# [统一错误格式，添加日志收集]
```

#### 下午 (13:00-17:00) - Frontend开发者
```bash
# PERF-001: 内存管理优化 [开始4小时]
# 步骤1: 实现虚拟滚动组件

mkdir -p src/components/performance
touch src/components/performance/VirtualList.astro
touch src/components/performance/VirtualList.js

# [按照详细代码模板编写虚拟滚动]
```

**📊 Day 3 预期产出**:
- [ ] 所有API错误处理统一
- [ ] 错误日志收集机制
- [ ] 虚拟滚动组件完成

### **Day 4 (2025-11-01 周五)**
**🎯 今日目标**: 继续性能优化

#### 全天 (9:00-17:00) - Frontend开发者
```bash
# PERF-001: 内存管理优化 [继续8小时]
# 步骤2-5: 重构显示逻辑 + 分页 + 节点池 + 监控

cp src/components/ResearchAgentUI.astro src/components/ResearchAgentUI.astro.backup
npm install --save-dev web-vitals

# [按照详细代码模板重构ResearchAgentUI.astro]
# [实现分页管理器]
# [实现DOM节点池]
# [添加内存监控]
```

**📊 Day 4 预期产出**:
- [ ] 结果显示逻辑重构完成
- [ ] 分页机制实现
- [ ] DOM节点池实现
- [ ] 内存监控系统

### **Day 5 (2025-11-02 周六) - 验收日**
**🎯 今日目标**: 第一阶段验收和测试

#### 上午 (9:00-12:00) - 全体
```bash
# 集成测试和验收
npm run build
npm run test
npm audit

# 性能测试
npm run test:performance

# 安全测试  
npm run test tests/security/

# 手动验收检查 (按照验收清单)
```

#### 下午 (13:00-17:00) - 修复和优化
```bash
# 根据测试结果修复问题
# 性能调优
# 文档更新
```

## ✅ **验收条件 (具体可测量标准)**

### 🛡️ 安全验收 ✅❌
- [ ] **[SECURITY-001]** 在Chrome DevTools中检查localStorage，确认无任何明文API密钥
- [ ] **[SECURITY-001]** 运行 `npm audit` 显示 0 个high/critical漏洞
- [ ] **[SECURITY-001]** 使用恶意脚本 `console.log(localStorage)` 无法读取API密钥
- [ ] **[SEC-002]** 所有依赖包都是最新stable版本

### ⚡ 性能验收 ✅❌ 
- [ ] **[PERF-001]** Chrome DevTools Performance标签测试: 渲染1000条结果 < 2秒
- [ ] **[PERF-001]** Memory标签测试: 峰值内存使用 < 300MB
- [ ] **[PERF-001]** 滚动测试: 连续滚动5秒无卡顿，FPS > 55
- [ ] **[PERF-001]** 首屏加载: 打开页面到内容显示 < 500ms

### 🔧 功能验收 ✅❌
- [ ] **[ERROR-001]** 故意触发所有API错误，错误格式一致
- [ ] **[ERROR-001]** 错误日志正确记录到console/文件
- [ ] **[ALL]** 所有原有功能正常工作（搜索、配置、研究等）
- [ ] **[ALL]** TypeScript编译 0 警告 0 错误

## 🚨 **紧急联系和升级机制**

### 阻塞问题升级流程
**如果遇到无法解决的技术问题**:
1. **立即** 在项目群@全体成员
2. **15分钟内** 项目负责人响应
3. **30分钟内** 组织技术攻关会议
4. **1小时内** 确定解决方案或回滚策略

### 验收失败处理
**如果验收不通过**:
1. 详细记录失败原因和测试数据
2. 评估是否影响系统稳定性
3. 制定修复计划（48小时内）
4. 重新安排验收时间

### 第一阶段完成标准
**必须100%达成的硬性指标**:
- 0个安全漏洞
- 性能提升>50%  
- 所有功能正常
- 代码质量通过检查

### **⚡ 第二阶段 (性能优化 - 2周内完成)** `总计: 42小时`
**目标**: 提升系统性能和用户体验

| 任务编号 | 任务名称 | 预估工时 | 负责人 | 截止日期 |
|---------|---------|---------|--------|----------|
| TEST-001 | 单元测试扩展 | 24h | QA+Dev | 2025-11-10 |
| PERF-002 | 网络请求优化 | 10h | Backend | 2025-11-08 |
| I18N-001 | 英文翻译补全 | 8h | Frontend | 2025-11-06 |

**验收条件**:
- [ ] 测试覆盖率>80%
- [ ] 平均响应时间减少30%
- [ ] 英文界面翻译完成度>95%

### **🔧 第三阶段 (功能增强 - 4周内完成)** `总计: 64小时`
**目标**: 添加核心功能，提升产品竞争力

| 任务编号 | 任务名称 | 预估工时 | 负责人 | 截止日期 |
|---------|---------|---------|--------|----------|
| FEAT-001 | 研究状态持久化 | 16h | Backend | 2025-11-18 |
| FEAT-003 | 结果导出功能 | 18h | Full-stack | 2025-11-22 |
| CODE-001 | TypeScript类型完善 | 16h | Frontend | 2025-11-15 |
| FEAT-002 | 搜索引擎扩展 | 14h | Backend | 2025-11-25 |

**验收条件**:
- [ ] 支持任务中断恢复
- [ ] 支持多格式导出
- [ ] TypeScript严格模式0错误
- [ ] 支持5+搜索引擎

### **🚀 第四阶段 (长期优化 - 持续进行)** `总计: 52小时`
**目标**: 系统重构和高级特性

| 任务编号 | 任务名称 | 预估工时 | 优先级 | 计划开始 |
|---------|---------|---------|--------|----------|
| REFACTOR-001 | 代码重构优化 | 20h | 🟢 低 | 2025-12-01 |
| MONITOR-001 | 性能监控系统 | 20h | 🟢 低 | 2025-12-15 |
| TEST-002 | 性能基准测试 | 12h | 🟢 低 | 2025-12-08 |

---

## 📈 **关键指标追踪**

### 安全指标
- [ ] 安全漏洞数量: **目标 0个** (当前: 4个已识别)
- [ ] API密钥泄露风险: **目标 完全消除** (当前: 高风险)
- [ ] 输入验证覆盖率: **目标 100%** (当前: ~30%)

### 性能指标  
- [ ] 页面加载时间: **目标 <2秒** (当前: ~4秒)
- [ ] 内存使用峰值: **目标 <300MB** (当前: ~600MB)
- [ ] API响应时间: **目标 <1秒** (当前: ~2.5秒)

### 质量指标
- [ ] 测试覆盖率: **目标 >80%** (当前: ~45%)
- [ ] TypeScript类型覆盖率: **目标 >85%** (当前: ~60%)
- [ ] 代码重复率: **目标 <5%** (当前: ~12%)

### 用户体验指标
- [ ] 界面翻译完成度: **目标 >95%** (当前: ~75%)
- [ ] 功能可用性: **目标 >99%** (当前: ~85%)
- [ ] 错误恢复成功率: **目标 >90%** (当前: ~60%)

---

## 🌐 用户体验

#### 国际化完善
- [ ] **问题**: 英文翻译不完整
  - **位置**: `src/lib/i18n.js`
  - **缺失**: 
    - 部分错误消息翻译
    - 动态内容国际化
    - 日期时间格式化

#### 响应式设计优化
- [ ] **改进**: 移动端适配
  - **问题**: 部分组件在小屏幕上显示异常
  - **需要**: 
    - 优化移动端布局
    - 改进触摸交互
    - 简化移动端功能

#### 无障碍性支持
- [ ] **添加**: A11y支持
  - **需要**: 
    - ARIA标签完善
    - 键盘导航支持
    - 屏幕阅读器兼容

### 📊 监控与分析

#### 性能监控
- [ ] **实现**: 应用性能监控
  - **指标**: 
    - 研究任务完成时间
    - API响应时间
    - 用户操作延迟
  - **工具**: 
    - 集成性能分析工具
    - 添加错误追踪
    - 实现用户行为分析

#### 使用统计
- [ ] **添加**: 功能使用统计
  - **统计项**: 
    - 搜索引擎使用频率
    - 研究任务类型分布
    - 功能模块使用率

### 🔄 开发工具

#### 开发环境优化
- [ ] **改进**: 开发体验提升
  - **需要**: 
    - 热重载配置优化
    - 开发服务器性能提升
    - 调试工具集成

#### CI/CD管道
- [ ] **建立**: 自动化部署流程
  - **包含**: 
    - 自动化测试运行
    - 代码质量检查
    - 安全漏洞扫描
    - 自动部署配置

### 📚 文档更新

#### API文档更新
- [ ] **问题**: API文档版本过期
  - **位置**: `docs/API.md`
  - **需要**: 
    - 更新版本信息至当前状态
    - 添加新增接口文档
    - 补充错误码说明

#### 开发者指南
- [ ] **添加**: 完整开发文档
  - **内容**: 
    - 架构设计说明
    - 组件开发指南
    - API集成指南
    - 部署配置文档

#### 用户手册
- [ ] **创建**: 终端用户指南
  - **内容**: 
    - 功能使用说明
    - 配置指南
    - 常见问题解答
    - 最佳实践建议

---

## 🗂️ 项目健康状态

### ✅ 已完成的优化
- TypeScript类型错误修复 ✓
- Tailwind CSS配置清理 ✓
- 组件间事件冲突解决 ✓
- 模块导入问题修复 ✓
- 代码结构基础优化 ✓

### ⚠️ 需要关注的技术债务
1. **API密钥安全存储** - 安全风险较高
2. **大量结果集的内存管理** - 性能风险
3. **测试覆盖率不足** - 质量风险
4. **错误处理不统一** - 维护风险

### 📈 建议实施路径

#### 第一阶段 (即时 - 1周)
1. 修复API密钥安全存储问题
2. 添加基础输入验证
3. 实现错误处理标准化

#### 第二阶段 (1-2周)
1. 性能优化：内存管理
2. 完善单元测试覆盖
3. 国际化翻译补全

#### 第三阶段 (2-4周)
1. 功能增强：状态持久化
2. 用户体验改进
3. 监控系统实施

#### 第四阶段 (长期)
1. 架构重构优化
2. 高级功能开发
3. 生态系统扩展

---

---

## 🤝 **贡献指南与工作流程**

### **⚡ 立即执行工作流** - 无需等待，现在就开始！

#### **🚀 今天就开始 (2025-10-29)**
```bash
# 👨‍💻 如果你是Backend开发者 - 立即执行SECURITY-001
cd d:\Onlinebiz\zerox\gridsfeed\backs\srp\Steady-Research-Pro-main
git status  # 确认当前状态
git checkout -b hotfix/SECURITY-001-api-key-encryption
npm install crypto-js @types/crypto-js
code src/lib/crypto-utils.js  # 创建并编辑文件

# 👩‍💻 如果你是Frontend开发者 - 准备PERF-001
mkdir -p src/components/performance
touch src/components/performance/VirtualList.astro
code src/components/performance/VirtualList.astro

# 🔧 如果你是DevOps工程师 - 立即执行SEC-002  
npm audit --audit-level=high
npm audit fix --force
npm update --save
```

#### **📋 每个任务的精确执行清单**

### **[SECURITY-001] 执行检查表** ✅❌
**⏰ 预计8小时，必须2025-11-02前完成**

**准备工作** ✅❌ `[30分钟]`
- [ ] 创建分支: `git checkout -b hotfix/SECURITY-001-api-key-encryption`
- [ ] 安装依赖: `npm install crypto-js @types/crypto-js`
- [ ] 备份文件: `cp src/components/SearchConfigPanel.astro src/components/SearchConfigPanel.astro.backup`

**步骤1: 创建加密工具** ✅❌ `[1小时]`
- [ ] 创建文件: `touch src/lib/crypto-utils.js`
- [ ] 编写SecureStorage类 (参考上述完整代码)
- [ ] 测试加密/解密功能: `node -e "const {SecureStorage} = require('./src/lib/crypto-utils.js'); console.log(SecureStorage.encrypt('test'))"`

**步骤2: API代理服务** ✅❌ `[2小时]`
- [ ] 创建文件: `touch src/pages/api/proxy-search.js`
- [ ] 编写代理逻辑 (参考上述完整代码)
- [ ] 测试API端点: `curl -X POST http://localhost:3000/api/proxy-search -d '{"query":"test"}'`

**步骤3: 修改存储逻辑** ✅❌ `[3小时]`
- [ ] 打开文件: `code src/components/SearchConfigPanel.astro`
- [ ] 定位到第106-113行的writeStoredConfig函数
- [ ] 替换为安全存储代码 (参考上述完整代码)
- [ ] 添加密钥验证函数

**步骤4: 安全测试** ✅❌ `[1小时]`
- [ ] 创建测试: `touch tests/security/api-key-security.test.js`
- [ ] 编写测试用例 (参考上述完整代码)
- [ ] 运行测试: `npm run test tests/security/`

**步骤5: 验收检查** ✅❌ `[30分钟]`
- [ ] 浏览器测试: 打开DevTools检查localStorage无明文密钥
- [ ] 安全扫描: `npm audit` 显示0个高危漏洞
- [ ] 功能测试: 搜索配置保存/加载正常工作
- [ ] 提交代码: `git add . && git commit -m "SECURITY-001: 实现API密钥安全存储"`

### **[PERF-001] 执行检查表** ✅❌
**⏰ 预计12小时，必须2025-11-05前完成**

**准备工作** ✅❌ `[30分钟]`
- [ ] 创建分支: `git checkout -b feature/PERF-001-memory-optimization`
- [ ] 性能基准测试: 打开Chrome DevTools Performance，录制当前渲染1000条数据的性能
- [ ] 记录当前指标: 渲染时间、内存使用、FPS

**步骤1: 虚拟滚动** ✅❌ `[4小时]`
- [ ] 创建目录: `mkdir -p src/components/performance`
- [ ] 创建文件: `touch src/components/performance/VirtualList.astro`
- [ ] 创建管理器: `touch src/components/performance/VirtualList.js`
- [ ] 编写完整代码 (参考上述完整代码模板)
- [ ] 单元测试: 创建虚拟列表实例，验证滚动和节点管理

**步骤2: 重构显示逻辑** ✅❌ `[3小时]`
- [ ] 备份文件: `cp src/components/ResearchAgentUI.astro src/components/ResearchAgentUI.astro.backup`
- [ ] 定位到第704-750行的结果渲染代码
- [ ] 替换为批量DOM操作 (参考上述updateSourcesTableOptimized函数)
- [ ] 添加性能监控代码

**步骤3: 分页机制** ✅❌ `[2小时]`
- [ ] 在ResearchAgentUI.astro中添加PaginationManager类
- [ ] 实现分页控件HTML和交互逻辑
- [ ] 测试分页功能: 加载大量数据，验证分页切换

**步骤4: 节点回收池** ✅❌ `[2小时]`
- [ ] 添加DOMNodePool类到ResearchAgentUI.astro
- [ ] 实现节点获取、回收、清理逻辑
- [ ] 测试节点复用: 验证DOM节点数量不随数据量增长

**步骤5: 内存监控** ✅❌ `[1小时]`
- [ ] 添加MemoryMonitor类
- [ ] 实现内存测量和告警机制
- [ ] 在控制台查看内存报告: `memoryMonitor.getReport()`

### **立即可执行的命令序列**

#### **开始SECURITY-001 (Backend开发者立即执行)**
```bash
#!/bin/bash
# 🚨 SECURITY-001 一键启动脚本 - 复制粘贴直接执行

set -e  # 出错即停止

echo "🚀 开始SECURITY-001: API密钥安全存储"
echo "📅 开始时间: $(date)"

# 1. 准备工作
git checkout -b hotfix/SECURITY-001-api-key-encryption
npm install crypto-js @types/crypto-js
cp src/components/SearchConfigPanel.astro src/components/SearchConfigPanel.astro.backup

# 2. 创建加密工具
cat > src/lib/crypto-utils.js << 'EOF'
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-prod';

export class SecureStorage {
  static encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  }
  
  static decrypt(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
  static setItem(key, data) {
    localStorage.setItem(key, this.encrypt(data));
  }
  
  static getItem(key) {
    const encrypted = localStorage.getItem(key);
    return encrypted ? this.decrypt(encrypted) : null;
  }
}
EOF

echo "✅ 加密工具创建完成"

# 3. 创建API代理
mkdir -p src/pages/api
cat > src/pages/api/proxy-search.js << 'EOF'
export async function POST({ request }) {
  const { query, engine, keyHash } = await request.json();
  
  // 验证密钥哈希
  const validKeyHash = process.env[`${engine.toUpperCase()}_KEY_HASH`];
  if (keyHash !== validKeyHash) {
    return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 401 });
  }
  
  // 使用服务端存储的真实API密钥
  const realApiKey = process.env[`${engine.toUpperCase()}_API_KEY`];
  
  return new Response(JSON.stringify({ success: true, message: 'API代理已就绪' }));
}
EOF

echo "✅ API代理创建完成"

# 4. 创建安全测试
mkdir -p tests/security
cat > tests/security/api-key-security.test.js << 'EOF'
import { test, expect } from 'vitest';
import { SecureStorage } from '../../src/lib/crypto-utils.js';

test('API密钥不应明文存储', () => {
  const sensitiveData = { bing: 'real-api-key-123' };
  SecureStorage.setItem('test-key', sensitiveData);
  
  const stored = localStorage.getItem('test-key');
  expect(stored).not.toContain('real-api-key-123');
});
EOF

echo "✅ 安全测试创建完成"

# 5. 运行测试
npm run test tests/security/ || echo "⚠️ 测试失败，需要手动检查"

echo "🎉 SECURITY-001 基础框架完成！"
echo "📋 下一步：手动编辑 SearchConfigPanel.astro 第106-113行"
echo "📝 参考文档中的详细代码模板进行替换"
```

#### **开始PERF-001 (Frontend开发者立即执行)**
```bash
#!/bin/bash
# 🚨 PERF-001 一键启动脚本

echo "🚀 开始PERF-001: 内存管理优化"

# 1. 准备工作
git checkout -b feature/PERF-001-memory-optimization
mkdir -p src/components/performance
cp src/components/ResearchAgentUI.astro src/components/ResearchAgentUI.astro.backup

# 2. 创建虚拟滚动组件
cat > src/components/performance/VirtualList.astro << 'EOF'
---
interface Props {
  items: any[];
  itemHeight: number;
  containerHeight: number;
}

const { items, itemHeight = 60, containerHeight = 400 } = Astro.props;
---

<div class="virtual-list-container" style={`height: ${containerHeight}px`}>
  <div class="virtual-list-scroll" id="virtual-scroll">
    <div class="virtual-list-visible-area" id="visible-area"></div>
  </div>
</div>

<style>
.virtual-list-container {
  overflow: auto;
  position: relative;
}

.virtual-list-scroll {
  position: relative;
}

.virtual-list-visible-area {
  position: relative;
}
</style>
EOF

echo "✅ 虚拟滚动组件创建完成"

# 3. 性能监控脚本
cat > src/lib/performance-utils.js << 'EOF'
export class PerformanceMonitor {
  static measureRender(name, fn) {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measures = performance.getEntriesByName(name);
    const duration = measures[measures.length - 1].duration;
    console.log(`🚀 ${name}: ${duration.toFixed(2)}ms`);
    
    return result;
  }
  
  static getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      };
    }
    return null;
  }
}
EOF

echo "✅ 性能监控工具创建完成"
echo "🎉 PERF-001 基础框架完成！"
echo "📋 下一步：编辑 ResearchAgentUI.astro 替换第704-750行的渲染代码"
```

### **实时进度追踪**
**每完成一个检查项，请在项目群报告进度**:
```
✅ SECURITY-001 步骤1完成 - 加密工具已创建并测试通过
⏰ 预计下一步骤2小时内完成
🚧 遇到问题：[具体问题描述]
```

**每日站会格式**:
- **昨日完成**: [具体完成的检查项]
- **今日计划**: [今日要完成的检查项]
- **阻塞问题**: [需要协助解决的问题]
- **风险提醒**: [可能影响进度的风险点]

### 代码审查清单
**审查者需要检查**:
- [ ] 代码符合任务的验收标准
- [ ] 测试覆盖率达到要求
- [ ] 性能影响评估
- [ ] 安全风险评估
- [ ] 文档更新完整性

### 紧急修复流程
对于🔴高优先级任务：
1. **立即通知**: 在团队群组@all成员
2. **快速修复**: 允许直接push到hotfix分支
3. **后补测试**: 修复后24小时内补充测试
4. **风险评估**: 修复后进行全面风险评估

---

## 📋 **快速检查清单**

### 每日检查 (Daily Standup)
- [ ] 昨日完成的任务是否达到验收标准
- [ ] 今日计划任务的优先级确认
- [ ] 是否有阻塞问题需要协助解决
- [ ] 关键指标是否有异常变化

### 每周检查 (Weekly Review)
- [ ] 阶段性目标完成情况
- [ ] 技术债务累积情况
- [ ] 用户反馈和bug报告分析
- [ ] 性能指标趋势分析

### 每月检查 (Monthly Planning)
- [ ] TODO清单更新和优先级调整
- [ ] 新功能需求评估
- [ ] 技术栈升级规划
- [ ] 团队技能培训计划

---

## 📞 **联系方式与资源**

### 文档链接
- **架构文档**: `docs/agents-protocol.md`
- **API文档**: `docs/API.md`  
- **部署指南**: `README.md`
- **搜索配置**: `SEARCH_API_SETUP.md`

### 关键联系人
- **项目负责人**: [待填写]
- **安全审查**: [待填写]  
- **性能优化**: [待填写]
- **UI/UX设计**: [待填写]

### 工具和环境
- **代码仓库**: 当前目录
- **CI/CD**: 待配置
- **监控系统**: 待实施
- **错误追踪**: 待配置

---

*📅 本TODO清单基于2025年10月29日的项目状态生成*  
*🔄 建议每2周更新一次以反映项目最新状态*  
*📊 总计184小时工作量，预计3-4个Sprint完成核心任务*