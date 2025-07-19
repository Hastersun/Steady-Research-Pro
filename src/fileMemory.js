// 文件存储上下文模块
const fs = require('fs');
const path = require('path');

/**
 * 读取指定路径的 JSON 文件
 * @param {string} filePath
 * @returns {object|null}
 */
function readContext(filePath) {
  try {
    const data = fs.readFileSync(path.resolve(filePath), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

/**
 * 将数据写入指定路径的 JSON 文件
 * @param {string} filePath
 * @param {object} context
 */
function writeContext(filePath, context) {
  fs.writeFileSync(path.resolve(filePath), JSON.stringify(context, null, 2), 'utf-8');
}

const https = require('https');
const http = require('http');

/**
 * 从 URL 读取 JSON 数据（异步）
 * @param {string} url
 * @returns {Promise<object|null>}
 */
function readContextFromUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

module.exports = { readContext, writeContext, readContextFromUrl };
