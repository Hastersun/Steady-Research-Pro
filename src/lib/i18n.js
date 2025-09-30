const SUPPORTED_LOCALES = ['zh-CN', 'en-US'];
const DEFAULT_LOCALE = 'zh-CN';
const STORAGE_KEY = 'steady-research-pro:locale';

const dictionaries = {
  'zh-CN': {
    common: {
      language: '语言',
      languageChinese: '简体中文',
      languageEnglish: 'English',
      unknown: '（缺少翻译）',
      statusIdle: '未连接',
      statusTesting: '测试中',
      statusReady: '连接正常',
      statusError: '服务离线'
    },
    layout: {
      researchControlBadge: 'Research Control',
      title: 'Steady Research Pro',
      subtitle: 'Deep Research Agent Suite',
      quickTipTitle: '实时保持研究上下文',
      quickTipDescription: '在 Settings 中配置模型后，可一次完成规划、搜索、聚合与总结。',
      footer: '© 2025 Steady Research Pro · Crafted with Astro & Tailwind',
      betaVersion: 'Beta build 0.3.2',
      betaYear: '2025',
      researchBadge: 'Multi-source intelligence',
      researchSse: 'SSE streaming ready',
      researchHeadline: '多源智能研究工作台',
      researchDescription: '从模型调度到搜索聚合，全程可视化研究流程。通过自定义事件驱动的 UI 外壳，实时感知研究状态。',
      researchPlannerLabel: 'Planner',
      researchPlannerValue: '5-stage pipeline',
      researchPlannerHint: 'Plan → Search → Extract → Cluster → Synthesis',
      researchLatencyLabel: 'Latency',
      researchLatencyValue: '42s avg',
      researchLatencyHint: '基于最近 10 次研究的平均值',
      researchSourcesLabel: 'Sources',
      researchSourcesValue: '8 providers',
      researchSourcesHint: '支持本地 Ollama 与主流云端 API'
    },
    navigation: {
      research: 'Research 仪表盘',
      researchHint: 'Agent workflow',
      settings: 'Settings 设置',
      settingsHint: 'Providers & 搜索'
    },
    languageSwitcher: {
      label: '界面语言',
      zh: '简体中文',
      en: 'English'
    },
    hero: {
      realtimeBadge: 'Realtime orchestration',
      title: 'Deep Research Agent',
      description: '智能聚合多源信息，驱动可视化推理与搜索日志。通过事件总线与流式后端协作，实现由浅到深的洞察生成。',
      capabilitySse: '⚡ SSE 推理',
      capabilitySearch: '🔎 多源搜索',
      capabilityTimeline: '🧭 时间线追踪',
      capabilityReport: '🗂️ 聚合报告',
      currentTask: '当前任务',
      currentTaskIdle: 'Idle',
      currentTaskHint: '等待研究主题',
      latestOutput: '最新输出',
      latestOutputHint: '最近一次完成时间',
      quickStartTitle: '🎯 快速开始',
      quickStartDescription: '在左侧填写主题并选择模型，系统将自动规整研究流程并同步推理轨迹。',
      staySyncedTitle: '🔁 保持同步',
      staySyncedDescription: 'Settings 中切换服务后，SidePanel 会自动刷新可用模型列表并提示联机状态。',
      exportTitle: '📦 导出结果',
      exportDescription: '完成后可在结果卡片中扩展详情，整理结构化结论与引用来源。',
      reasoningTitle: '推理轨迹'
    },
    sidePanel: {
      title: 'AI 研究配置',
      topicLabel: '研究主题',
      topicPlaceholder: '例如：大语言模型在教育领域的应用',
      modelLabel: '选择 AI 模型',
      modelLoading: '加载中...',
      modelPlaceholder: '请选择模型',
      modelConfigHint: '使用 Settings 页面的当前服务配置',
      depthLabel: '深度级别',
      depthBasic: '基础分析',
      depthStandard: '标准研究',
      depthDeep: '深度研究',
      focusLabel: '研究重点',
      focusPlaceholder: '描述特定的研究角度或关注点...',
      stop: '停止',
      start: '开始 AI 研究',
      progressTitle: '进度',
      progressIdle: '0% · 等待开始',
  progressIdleLabel: '等待开始',
  progressStopped: '已停止',
  progressCompleted: '研究完成',
      providerMissing: '当前没有配置 AI 服务，请先前往 Settings 设置。',
      providerStatus: '当前服务：{name} · 状态：{status}{model}',
      providerStatusConnected: '已连接',
      providerStatusDisconnected: '未连接',
      providerStatusModelSuffix: ' · 模型：{model}',
      validationTopic: '请输入研究主题',
      validationProvider: '请先在 Settings 页面配置 AI 服务',
      validationModel: '请选择或配置 AI 模型',
      validationOffline: '当前 AI 服务未连接，请先在 Settings 页面测试连接',
  researchFailed: '研究失败: {message}',
      stepPlan: '生成研究计划',
      stepSearch: '多源搜索',
      stepExtract: '内容提取',
      stepCluster: '主题聚类',
      stepSynthesis: '综合分析',
      stepComplete: '✓ 完成',
      stepRunning: '🔄 进行中'
    },
    researchFlow: {
      pipelinePlan: '生成初步研究计划',
      pipelineSearch: '多源搜索与抓取',
      pipelineExtract: '内容清洗与摘要抽取',
      pipelineCluster: '主题聚类与归纳',
      pipelineSynthesis: '综合分析与洞察输出',
      timelineDone: '完成',
      timelineActive: '进行中...',
      timelineStatusDone: '完成',
      timelineStatusRunning: '进行中',
      timelineStatusPending: '',
      detailPending: '待执行',
      detailRunning: '执行中',
      detailDone: '完成',
      detailStart: '开始: {label}',
      detailFinish: '完成 ✓',
      searchProgress: '搜索中',
      logPlaceholder: '搜索',
      logSearchLine: '[search] query#{index} 触发 -> 模拟结果 {token}',
      logSearchLabel: '搜索'
    },
    resultsGrid: {
      title: '研究结果',
      empty: '等待研究开始后展示聚合结果',
      placeholderTitle: '研究结果占位卡片',
      placeholderDescription: '完成研究后，这里会展示结构化总结、关键结论与引用来源。',
      expand: '展开详情',
      collapse: '收起详情',
      moduleLabel: 'Module',
      confidenceLabel: '置信度',
      sectionFramework: '模型评测框架',
      sectionBenchmark: 'Benchmark 对比',
      sectionExperiment: '实验设计建议',
      sectionRisk: '风险与限制',
      sectionTrend: '趋势洞察',
      sectionAction: '行动清单'
    },
    sourcesTable: {
      title: '来源快照',
      empty: '暂无搜索记录',
      sourceLabel: '来源',
      snippetLabel: '摘要',
      scoreLabel: '相关度',
      visit: '访问',
      columnTitle: '标题',
      columnDomain: '域',
      columnType: '类型',
      columnScore: '评分',
      columnActions: '操作',
      badgeBlog: 'Blog',
      placeholderTitle: 'OpenAI 发布新评测基准集：更全面衡量 LLM 推理能力',
      viewLabel: '查看',
      citeLabel: '引用'
    },
    aiService: {
      badge: 'AI Routing',
      title: 'AI 服务接入',
      description: '集中管理并测试各类模型提供商的访问配置',
      current: '当前服务',
      currentDefault: '本地Ollama',
      currentDetails: '使用本地Ollama服务进行AI对话',
      selectLabel: '选择 AI 服务提供商',
      optionOllama: '本地Ollama',
      optionDeepseek: 'DeepSeek',
      optionOpenai: 'OpenAI',
      optionClaude: 'Claude (Anthropic)',
      optionGemini: 'Google Gemini',
      localTitle: '本地 Ollama 服务',
      localDescription: '无需 API 密钥，直接连接本地部署模型',
      statusDisconnected: '未连接',
      statusConfigured: '未配置',
      urlLabel: '服务地址',
      modelLabel: '首选模型',
      modelLoading: '加载中...',
      testButton: '测试连接',
      remoteTitle: '云端 API 服务',
      remoteDescription: '请配置 API 密钥以使用此服务',
      remoteKeyLabel: 'API 密钥',
      remoteKeyPlaceholder: '请输入 API 密钥',
      remoteModelLabel: '模型选择',
      remoteModelPlaceholder: '请选择模型',
  noModels: '暂无模型',
  currentDetailsWithUrl: '使用本地Ollama服务 ({url})',
  remoteInfoDeepseek: '高性能大语言模型，支持中英文对话',
  remoteInfoOpenai: '领先的通用对话模型，可完成生成和分析任务',
  remoteInfoClaude: '擅长分析和推理的安全大模型',
  remoteInfoGemini: '谷歌最新多模态模型，擅长创意和多模态任务',
      statusTesting: '测试中',
      statusReady: '连接正常',
      statusOffline: '服务离线',
      statusMissingKey: '未配置',
  statusFailed: '连接失败',
  statusError: '连接异常',
  statusPending: '待测试',
  statusNoModels: '暂无模型',
      toastSuccess: '连接测试成功',
      toastFailure: '连接测试失败'
    },
    searchConfig: {
      badge: 'Search Orchestration',
      title: '搜索引擎 API 配置',
      description: '配置 Bing / Google 密钥并验证检索与研究链路',
      statusIdle: '待配置',
      apiSectionTitle: 'API 密钥管理',
      apiSectionDescription: '保存后会将配置缓存在浏览器本地存储中',
      bingLabel: 'Bing API 密钥',
      bingPlaceholder: '输入 Bing Search API 密钥',
      googleLabel: 'Google API 密钥',
      googlePlaceholder: '输入 Google Custom Search API 密钥',
      googleCseLabel: 'Google CSE ID',
      googleCsePlaceholder: '输入 Google Custom Search Engine ID',
      saveButton: '保存配置',
      testSectionTitle: '搜索测试',
      testSectionDescription: '校验外部检索服务是否已就绪',
      queryLabel: '测试查询',
      queryPlaceholder: '输入搜索查询',
      queryDefault: '人工智能发展趋势',
      enginesBing: 'Bing',
      enginesGoogle: 'Google',
      testButton: '测试搜索',
      resultsTitle: '搜索结果',
      resultsDescription: '展示最近一次搜索测试的聚合结果',
      toastSaveSuccess: '配置保存成功!',
      toastSearchRunning: '正在发起搜索...',
      toastSearchEmpty: '请至少选择一个搜索引擎',
      toastSearchQueryMissing: '请输入搜索查询',
      toastSearchError: '搜索失败: {message}',
      toastSearchSuccess: '搜索完成，共返回 {count} 条结果',
      toastSaveError: '保存失败，请重试',
      toastConfigLoaded: '已应用保存的搜索配置'
    }
  },
  'en-US': {
    common: {
      language: 'Language',
      languageChinese: 'Simplified Chinese',
      languageEnglish: 'English',
      unknown: '(missing translation)',
      statusIdle: 'Disconnected',
      statusTesting: 'Testing',
      statusReady: 'Online',
      statusError: 'Offline'
    },
    layout: {
      researchControlBadge: 'Research Control',
      title: 'Steady Research Pro',
      subtitle: 'Deep Research Agent Suite',
      quickTipTitle: 'Keep research context in sync',
      quickTipDescription: 'Once providers are configured in Settings, you can run planning, search, clustering, and synthesis in a single flow.',
      footer: '© 2025 Steady Research Pro · Crafted with Astro & Tailwind',
      betaVersion: 'Beta build 0.3.2',
      betaYear: '2025',
      researchBadge: 'Multi-source intelligence',
      researchSse: 'SSE streaming ready',
      researchHeadline: 'Unified research workstation',
      researchDescription: 'From orchestration to search aggregation, monitor every stage visually. The event-driven UI shell mirrors real-time research progress.',
      researchPlannerLabel: 'Planner',
      researchPlannerValue: '5-stage pipeline',
      researchPlannerHint: 'Plan → Search → Extract → Cluster → Synthesis',
      researchLatencyLabel: 'Latency',
      researchLatencyValue: '42s avg',
      researchLatencyHint: 'Rolling average across the last 10 runs',
      researchSourcesLabel: 'Sources',
      researchSourcesValue: '8 providers',
      researchSourcesHint: 'Works with local Ollama and major cloud APIs'
    },
    navigation: {
      research: 'Research Dashboard',
      researchHint: 'Agent workflow',
      settings: 'Settings',
      settingsHint: 'Providers & Search'
    },
    languageSwitcher: {
      label: 'Language',
      zh: '简体中文',
      en: 'English'
    },
    hero: {
      realtimeBadge: 'Realtime orchestration',
      title: 'Deep Research Agent',
      description: 'Aggregate multi-source intelligence, drive visual reasoning and search logs. An event bus keeps the UI in sync with streaming backends.',
      capabilitySse: '⚡ SSE inference',
      capabilitySearch: '🔎 Multi-source search',
      capabilityTimeline: '🧭 Timeline tracking',
      capabilityReport: '🗂️ Consolidated reports',
      currentTask: 'Current task',
      currentTaskIdle: 'Idle',
      currentTaskHint: 'Waiting for a topic',
      latestOutput: 'Latest completion',
      latestOutputHint: 'Timestamp of the last run',
      quickStartTitle: '🎯 Quick start',
      quickStartDescription: 'Provide a topic and pick a model on the left—everything else stays in sync automatically.',
      staySyncedTitle: '🔁 Stay in sync',
      staySyncedDescription: 'Updating providers in Settings refreshes available models and connection status in the SidePanel.',
      exportTitle: '📦 Export findings',
      exportDescription: 'Open a result card for structured insights, key takeaways, and cited sources.',
      reasoningTitle: 'Reasoning trail'
    },
    sidePanel: {
      title: 'Research setup',
      topicLabel: 'Research topic',
      topicPlaceholder: 'e.g. LLM adoption in education',
      modelLabel: 'AI model',
      modelLoading: 'Loading...',
      modelPlaceholder: 'Select a model',
      modelConfigHint: 'Using provider configuration from Settings',
      depthLabel: 'Depth level',
      depthBasic: 'Quick scan',
      depthStandard: 'Standard research',
      depthDeep: 'Deep research',
      focusLabel: 'Research focus',
      focusPlaceholder: 'Describe specific angles or focus areas...',
      stop: 'Stop',
      start: 'Run research',
      progressTitle: 'Progress',
      progressIdle: '0% · Waiting to start',
  progressIdleLabel: 'Waiting to start',
  progressStopped: 'Stopped',
  progressCompleted: 'Completed',
      providerMissing: 'No provider configured. Please configure a service in Settings first.',
      providerStatus: 'Provider: {name} · Status: {status}{model}',
      providerStatusConnected: 'online',
      providerStatusDisconnected: 'offline',
      providerStatusModelSuffix: ' · Model: {model}',
      validationTopic: 'Enter a research topic',
      validationProvider: 'Configure an AI provider in Settings first',
      validationModel: 'Select or configure an AI model',
      validationOffline: 'Provider is offline. Test the connection in Settings first.',
  researchFailed: 'Research failed: {message}',
      stepPlan: 'Planning',
      stepSearch: 'Federated search',
      stepExtract: 'Content extraction',
      stepCluster: 'Topic clustering',
      stepSynthesis: 'Insight synthesis',
      stepComplete: '✓ Done',
      stepRunning: '🔄 Running'
    },
    researchFlow: {
      pipelinePlan: 'Drafting a research plan',
      pipelineSearch: 'Searching across sources',
      pipelineExtract: 'Extracting and summarising content',
      pipelineCluster: 'Clustering topics',
      pipelineSynthesis: 'Synthesising insights',
      timelineDone: 'Done',
      timelineActive: 'Running...',
      timelineStatusDone: 'Done',
      timelineStatusRunning: 'Running',
      timelineStatusPending: '',
      detailPending: 'Queued',
      detailRunning: 'Running',
      detailDone: 'Completed',
      detailStart: 'Start: {label}',
      detailFinish: 'Done ✓',
      searchProgress: 'Searching',
      logPlaceholder: 'search',
      logSearchLine: '[search] query#{index} triggered → mock result {token}',
      logSearchLabel: 'search'
    },
    resultsGrid: {
      title: 'Research output',
      empty: 'Results will appear here once a run completes.',
      placeholderTitle: 'Result card placeholder',
      placeholderDescription: 'After the run finishes you can expand cards for structured summaries and citations.',
      expand: 'Expand details',
      collapse: 'Collapse',
      moduleLabel: 'Module',
      confidenceLabel: 'Confidence',
      sectionFramework: 'Evaluation framework',
      sectionBenchmark: 'Benchmark comparison',
      sectionExperiment: 'Experiment design ideas',
      sectionRisk: 'Risks & limitations',
      sectionTrend: 'Trend insights',
      sectionAction: 'Action items'
    },
    sourcesTable: {
      title: 'Source snapshots',
      empty: 'No search records yet',
      sourceLabel: 'Source',
      snippetLabel: 'Snippet',
      scoreLabel: 'Relevance',
      visit: 'Visit',
      columnTitle: 'Title',
      columnDomain: 'Domain',
      columnType: 'Type',
      columnScore: 'Score',
      columnActions: 'Actions',
      badgeBlog: 'Blog',
      placeholderTitle: 'OpenAI releases new benchmark suite for LLM reasoning',
      viewLabel: 'Preview',
      citeLabel: 'Cite'
    },
    aiService: {
      badge: 'AI Routing',
      title: 'AI service providers',
      description: 'Manage and test connectivity for each model provider',
      current: 'Current provider',
      currentDefault: 'Local Ollama',
      currentDetails: 'Using local Ollama for conversations',
      selectLabel: 'Choose an AI provider',
      optionOllama: 'Local Ollama',
      optionDeepseek: 'DeepSeek',
      optionOpenai: 'OpenAI',
      optionClaude: 'Claude (Anthropic)',
      optionGemini: 'Google Gemini',
      localTitle: 'Local Ollama service',
      localDescription: 'No API key required. Connect to models running locally.',
      statusDisconnected: 'Offline',
      statusConfigured: 'Missing key',
      urlLabel: 'Endpoint',
      modelLabel: 'Preferred model',
      modelLoading: 'Loading...',
      testButton: 'Test connection',
      remoteTitle: 'Cloud API service',
      remoteDescription: 'Provide an API key to use this provider',
      remoteKeyLabel: 'API key',
      remoteKeyPlaceholder: 'Enter an API key',
      remoteModelLabel: 'Available models',
      remoteModelPlaceholder: 'Select a model',
  noModels: 'No models available',
  currentDetailsWithUrl: 'Local Ollama service ({url})',
  remoteInfoDeepseek: 'High-performance bilingual model tuned for reasoning',
  remoteInfoOpenai: 'Leading general-purpose models for generation and analysis',
  remoteInfoClaude: 'Safety-first model family optimised for reasoning',
  remoteInfoGemini: 'Google’s multimodal models built for creative tasks',
      statusTesting: 'Testing',
      statusReady: 'Online',
      statusOffline: 'Offline',
      statusMissingKey: 'Not configured',
  statusFailed: 'Connection failed',
  statusError: 'Connection error',
  statusPending: 'Pending test',
  statusNoModels: 'No models',
      toastSuccess: 'Connection test succeeded',
      toastFailure: 'Connection test failed'
    },
    searchConfig: {
      badge: 'Search Orchestration',
      title: 'Search API setup',
      description: 'Configure Bing / Google keys and validate the research chain',
      statusIdle: 'Pending setup',
      apiSectionTitle: 'API key management',
      apiSectionDescription: 'Saved keys are stored securely in local storage.',
      bingLabel: 'Bing API key',
      bingPlaceholder: 'Enter your Bing Search API key',
      googleLabel: 'Google API key',
      googlePlaceholder: 'Enter your Google Custom Search API key',
      googleCseLabel: 'Google CSE ID',
      googleCsePlaceholder: 'Enter your Google Custom Search Engine ID',
      saveButton: 'Save configuration',
      testSectionTitle: 'Search test',
      testSectionDescription: 'Validate that external search services are ready',
      queryLabel: 'Test query',
      queryPlaceholder: 'Enter a search query',
      queryDefault: 'AI development trends',
      enginesBing: 'Bing',
      enginesGoogle: 'Google',
      testButton: 'Run test search',
      resultsTitle: 'Search results',
      resultsDescription: 'Latest aggregated results from test search',
      toastSaveSuccess: 'Configuration saved!',
      toastSearchRunning: 'Running search...',
      toastSearchEmpty: 'Select at least one search engine',
      toastSearchQueryMissing: 'Enter a search query first',
      toastSearchError: 'Search failed: {message}',
      toastSearchSuccess: 'Search completed with {count} results',
      toastSaveError: 'Failed to save. Try again.',
      toastConfigLoaded: 'Loaded saved search configuration'
    }
  }
};

function hasWindow() {
  return typeof window !== 'undefined';
}

function normaliseLocale(locale) {
  if (!locale) return DEFAULT_LOCALE;
  const matched = SUPPORTED_LOCALES.find((item) => item.toLowerCase() === String(locale).toLowerCase());
  return matched || DEFAULT_LOCALE;
}

function getStoredLocale() {
  if (!hasWindow()) return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_LOCALE;
    return normaliseLocale(stored);
  } catch (error) {
    console.warn('[i18n] Failed to read stored locale', error);
    return DEFAULT_LOCALE;
  }
}

let currentLocale = getStoredLocale();

function setStoredLocale(locale) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch (error) {
    console.warn('[i18n] Failed to persist locale', error);
  }
}

function resolveKey(path, locale) {
  const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  if (!path) return null;
  const segments = path.split('.');
  let current = dict;
  for (const segment of segments) {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      current = current[segment];
    } else {
      return null;
    }
  }
  if (typeof current === 'string') return current;
  return null;
}

function formatTemplate(text, params = {}) {
  if (typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (_, key) => (params[key] ?? params[key] === 0 ? params[key] : `{${key}}`));
}

export function getLocale() {
  return currentLocale;
}

export function t(key, params = {}, locale = currentLocale) {
  const resolved = resolveKey(key, locale) ?? resolveKey(key, DEFAULT_LOCALE) ?? dictionaries[DEFAULT_LOCALE]?.common?.unknown;
  return formatTemplate(resolved, params);
}

export function setLocale(locale) {
  const nextLocale = normaliseLocale(locale);
  if (nextLocale === currentLocale) return currentLocale;
  currentLocale = nextLocale;
  setStoredLocale(currentLocale);
  if (hasWindow()) {
    document.documentElement.setAttribute('lang', currentLocale);
    document.documentElement.dataset.locale = currentLocale;
    const event = new CustomEvent('localechange', { detail: { locale: currentLocale } });
    document.dispatchEvent(event);
    applyTranslations();
  }
  return currentLocale;
}

export function applyTranslations(root) {
  if (!hasWindow()) return;
  const scope = root instanceof Element || root instanceof Document ? root : document;
  const locale = currentLocale;
  const elements = scope.querySelectorAll('[data-i18n], [data-i18n-html]');
  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const key = el.dataset.i18n;
    const htmlKey = el.dataset.i18nHtml;
    if (htmlKey) {
      const value = t(htmlKey, {}, locale);
      if (value) el.innerHTML = value;
    } else if (key) {
      const value = t(key, {}, locale);
      if (value) el.textContent = value;
    }

    Object.entries(el.dataset).forEach(([name, value]) => {
      if (!name.startsWith('i18nAttr')) return;
      const attrKey = value;
      if (!attrKey) return;
      const attribute = name
        .replace('i18nAttr', '')
        .replace(/^[A-Z]/, (match) => match.toLowerCase())
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      if (!attribute) return;
      const translated = t(attrKey, {}, locale);
      if (translated !== null && translated !== undefined) {
        el.setAttribute(attribute, translated);
      }
    });
  });
}

export function onLocaleChange(callback) {
  if (!hasWindow() || typeof callback !== 'function') return () => {};
  const handler = (event) => {
    const locale = event?.detail?.locale || currentLocale;
    callback(locale);
  };
  document.addEventListener('localechange', handler);
  return () => document.removeEventListener('localechange', handler);
}

export function initLocale() {
  if (!hasWindow()) return;
  const locale = normaliseLocale(document.documentElement.getAttribute('lang') || currentLocale);
  currentLocale = locale;
  document.documentElement.setAttribute('lang', currentLocale);
  document.documentElement.dataset.locale = currentLocale;
  if (!window.__steadyI18n) {
    window.__steadyI18n = {
      getLocale,
      setLocale,
      t,
      applyTranslations,
      onLocaleChange,
      SUPPORTED_LOCALES,
      initLocale
    };
  }
  const readyState = document.readyState;
  if (readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations(document));
  } else {
    applyTranslations(document);
  }
}

if (hasWindow()) {
  initLocale();
}
