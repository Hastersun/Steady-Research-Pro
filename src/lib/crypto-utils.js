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

export function hashApiKey(key) {
  return CryptoJS.SHA256(key).toString().substring(0, 16);
}

export function validateApiKey(key, type) {
  const validations = {
    bing: /^[a-f0-9]{32}$/i,      // Bing key format
    google: /^AIza[0-9A-Za-z_-]{35,39}$/ // Google key format (更宽松的长度范围)
  };
  
  if (!validations[type]) {
    throw new Error(`Unsupported API key type: ${type}`);
  }
  
  if (!validations[type].test(key)) {
    throw new Error(`Invalid ${type} API key format`);
  }
  
  return true;
}