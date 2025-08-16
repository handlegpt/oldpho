import { Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'ShinAI-language';
const LANGUAGE_STORAGE_VERSION = '1.0';

// 定义有效的语言选项
const VALID_LANGUAGES: Language[] = ['en', 'zh-TW', 'ja'];

// 语言存储数据结构
interface LanguageStorageData {
  language: Language;
  version: string;
  timestamp: number;
  checksum?: string;
}

// 简单的数据完整性检查
const calculateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return hash.toString(36);
};

// 验证存储的数据
const validateStoredData = (data: any): Language | null => {
  try {
    // 检查是否是对象
    if (!data || typeof data !== 'object') {
      return null;
    }

    // 检查必要字段
    if (!data.language || !data.version || !data.timestamp) {
      return null;
    }

    // 验证语言值
    if (!VALID_LANGUAGES.includes(data.language)) {
      return null;
    }

    // 检查版本兼容性
    if (data.version !== LANGUAGE_STORAGE_VERSION) {
      return null;
    }

    // 检查时间戳是否合理（不超过1年）
    const now = Date.now();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (data.timestamp < now - oneYear || data.timestamp > now + 24 * 60 * 60 * 1000) {
      return null;
    }

    // 可选：验证校验和
    if (data.checksum) {
      const expectedChecksum = calculateChecksum(data.language + data.version + data.timestamp);
      if (data.checksum !== expectedChecksum) {
        return null;
      }
    }

    return data.language;
  } catch (error) {
    console.warn('Language storage validation error:', error);
    return null;
  }
};

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!stored) {
      return getDefaultLanguage();
    }

    // 尝试解析JSON
    const parsedData = JSON.parse(stored);
    const validatedLanguage = validateStoredData(parsedData);
    
    if (validatedLanguage) {
      return validatedLanguage;
    }

    // 如果新格式验证失败，尝试旧格式兼容
    if (typeof stored === 'string' && VALID_LANGUAGES.includes(stored as Language)) {
      // 迁移到新格式
      setStoredLanguage(stored as Language);
      return stored as Language;
    }

    // 如果都失败，返回默认语言
    return getDefaultLanguage();
  } catch (error) {
    console.warn('Error reading language from storage:', error);
    return getDefaultLanguage();
  }
};

export const setStoredLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;
  
  // 验证输入
  if (!VALID_LANGUAGES.includes(language)) {
    console.warn('Invalid language:', language);
    return;
  }

  try {
    const storageData: LanguageStorageData = {
      language,
      version: LANGUAGE_STORAGE_VERSION,
      timestamp: Date.now(),
      checksum: calculateChecksum(language + LANGUAGE_STORAGE_VERSION + Date.now())
    };

    localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving language to storage:', error);
    // 降级到简单存储
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
    }
  }
};

// 获取默认语言的函数
const getDefaultLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  try {
    // 基于浏览器语言自动选择
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) return 'zh-TW';
    if (browserLang.startsWith('ja')) return 'ja';
  } catch (error) {
    console.warn('Error detecting browser language:', error);
  }
  
  return 'en';
};

// 清理过期的存储数据
export const cleanupLanguageStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      const now = Date.now();
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      
      // 删除超过1年的数据
      if (parsedData.timestamp && parsedData.timestamp < now - oneYear) {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      }
    }
  } catch (error) {
    console.warn('Error cleaning up language storage:', error);
  }
}; 