// 通用辅助函数，供多代理工作流使用

/**
 * 从 LLM 返回的文本中提取 JSON 数据。
 * 会尝试解析 ```json``` 代码块或首个 JSON 片段。
 * @param {string} text
 * @returns {any | null}
 */
export function extractJson(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fencedMatch ? fencedMatch[1] : text;

  const startIndex = raw.search(/[\[{]/);
  if (startIndex === -1) {
    return null;
  }

  const trimmed = raw.slice(startIndex).trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // 尝试去除尾随字符后再次解析
    const lastBrace = trimmed.lastIndexOf('}');
    const lastBracket = trimmed.lastIndexOf(']');
    const cutIndex = Math.max(lastBrace, lastBracket);
    if (cutIndex > 0) {
      try {
        return JSON.parse(trimmed.slice(0, cutIndex + 1));
      } catch (error2) {
        console.warn('[agents] JSON parse retry failed', error2);
      }
    }
    console.warn('[agents] JSON parse failed', error);
    return null;
  }
}

/**
 * 生成简单的 Markdown 大纲，提取一级和二级标题。
 * @param {string} markdown
 * @returns {Array<{ heading: string, level: number, bullets: string[] }>}
 */
export function buildOutline(markdown = '') {
  if (typeof markdown !== 'string' || !markdown.trim()) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const outline = [];
  let current = null;

  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      current = { heading, level, bullets: [] };
      outline.push(current);
      return;
    }

    if (current && line.trim().startsWith('-')) {
      const bullet = line.replace(/^-\s*/, '').trim();
      if (bullet) {
        current.bullets.push(bullet);
      }
    }
  });

  return outline;
}

/**
 * 限制字符串长度，避免提示词过长。
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncate(text, max = 4000) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}\n...\n[truncated ${text.length - max} chars]`;
}
