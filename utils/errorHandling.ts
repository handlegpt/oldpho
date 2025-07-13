import { Language } from './translations';

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  suggestions?: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'api' | 'network' | 'validation' | 'rate_limit' | 'processing' | 'auth' | 'system';
  timestamp: string;
  context?: any;
}

export interface ErrorRetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export const errorCodes = {
  // API 相关错误
  REPLICATE_API_ERROR: 'REPLICATE_API_ERROR',
  REPLICATE_QUOTA_EXCEEDED: 'REPLICATE_QUOTA_EXCEEDED',
  REPLICATE_MODEL_UNAVAILABLE: 'REPLICATE_MODEL_UNAVAILABLE',
  REPLICATE_INVALID_INPUT: 'REPLICATE_INVALID_INPUT',
  
  // 处理相关错误
  PROCESSING_TIMEOUT: 'PROCESSING_TIMEOUT',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  IMAGE_CORRUPTED: 'IMAGE_CORRUPTED',
  
  // 内容相关错误
  NSFW_DETECTED: 'NSFW_DETECTED',
  INVALID_CONTENT: 'INVALID_CONTENT',
  
  // 速率限制
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  MONTHLY_LIMIT_EXCEEDED: 'MONTHLY_LIMIT_EXCEEDED',
  
  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_UNREACHABLE: 'NETWORK_UNREACHABLE',
  
  // 认证错误
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  
  // 系统错误
  DATABASE_ERROR: 'DATABASE_ERROR',
  REDIS_ERROR: 'REDIS_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const errorMessages = {
  'zh-TW': {
    REPLICATE_API_ERROR: 'AI 服務暫時不可用，請稍後重試',
    REPLICATE_QUOTA_EXCEEDED: 'AI 服務配額已用完，請稍後重試',
    REPLICATE_MODEL_UNAVAILABLE: 'AI 模型暫時不可用，請稍後重試',
    REPLICATE_INVALID_INPUT: '圖片格式不支援，請上傳 JPG 或 PNG 格式',
    PROCESSING_TIMEOUT: '圖片處理超時，請嘗試較小的圖片',
    PROCESSING_FAILED: '圖片處理失敗，請重試',
    INVALID_IMAGE_FORMAT: '圖片格式不支援，請上傳 JPG 或 PNG 格式',
    IMAGE_TOO_LARGE: '圖片太大，請壓縮後重試',
    IMAGE_CORRUPTED: '圖片檔案損壞，請重新上傳',
    NSFW_DETECTED: '檢測到不當內容，請上傳合適的圖片',
    INVALID_CONTENT: '圖片內容不符合要求，請重新選擇',
    RATE_LIMIT_EXCEEDED: '本月免費次數已用完',
    DAILY_LIMIT_EXCEEDED: '今日免費次數已用完',
    MONTHLY_LIMIT_EXCEEDED: '本月免費次數已用完',
    NETWORK_ERROR: '網路連線問題，請檢查網路',
    NETWORK_TIMEOUT: '網路請求超時，請重試',
    NETWORK_UNREACHABLE: '網路不可達，請檢查網路連線',
    AUTH_REQUIRED: '請先登入',
    AUTH_EXPIRED: '登入已過期，請重新登入',
    AUTH_INVALID: '登入資訊無效，請重新登入',
    DATABASE_ERROR: '系統暫時不可用，請稍後重試',
    REDIS_ERROR: '系統暫時不可用，請稍後重試',
    CONFIGURATION_ERROR: '系統設定錯誤，請聯絡客服',
    UNKNOWN_ERROR: '處理過程中出現錯誤，請重試',
  },
  en: {
    REPLICATE_API_ERROR: 'AI service temporarily unavailable, please try again later',
    REPLICATE_QUOTA_EXCEEDED: 'AI service quota exceeded, please try again later',
    REPLICATE_MODEL_UNAVAILABLE: 'AI model temporarily unavailable, please try again later',
    REPLICATE_INVALID_INPUT: 'Image format not supported, please upload JPG or PNG format',
    PROCESSING_TIMEOUT: 'Image processing timeout, please try with a smaller image',
    PROCESSING_FAILED: 'Image processing failed, please try again',
    INVALID_IMAGE_FORMAT: 'Image format not supported, please upload JPG or PNG format',
    IMAGE_TOO_LARGE: 'Image too large, please compress and try again',
    IMAGE_CORRUPTED: 'Image file corrupted, please upload again',
    NSFW_DETECTED: 'Inappropriate content detected, please upload appropriate images',
    INVALID_CONTENT: 'Image content does not meet requirements, please choose another',
    RATE_LIMIT_EXCEEDED: 'Monthly free quota exceeded',
    DAILY_LIMIT_EXCEEDED: 'Daily free quota exceeded',
    MONTHLY_LIMIT_EXCEEDED: 'Monthly free quota exceeded',
    NETWORK_ERROR: 'Network connection issue, please check your network',
    NETWORK_TIMEOUT: 'Network request timeout, please try again',
    NETWORK_UNREACHABLE: 'Network unreachable, please check your connection',
    AUTH_REQUIRED: 'Please login first',
    AUTH_EXPIRED: 'Login expired, please login again',
    AUTH_INVALID: 'Invalid login information, please login again',
    DATABASE_ERROR: 'System temporarily unavailable, please try again later',
    REDIS_ERROR: 'System temporarily unavailable, please try again later',
    CONFIGURATION_ERROR: 'System configuration error, please contact support',
    UNKNOWN_ERROR: 'An error occurred during processing, please try again',
  },
  ja: {
    REPLICATE_API_ERROR: 'AI サービスが一時的に利用できません。後でもう一度お試しください',
    REPLICATE_QUOTA_EXCEEDED: 'AI サービスクォータが上限に達しました。後でもう一度お試しください',
    REPLICATE_MODEL_UNAVAILABLE: 'AI モデルが一時的に利用できません。後でもう一度お試しください',
    REPLICATE_INVALID_INPUT: '画像形式がサポートされていません。JPG または PNG 形式でアップロードしてください',
    PROCESSING_TIMEOUT: '画像処理がタイムアウトしました。小さな画像でお試しください',
    PROCESSING_FAILED: '画像処理に失敗しました。もう一度お試しください',
    INVALID_IMAGE_FORMAT: '画像形式がサポートされていません。JPG または PNG 形式でアップロードしてください',
    IMAGE_TOO_LARGE: '画像が大きすぎます。圧縮してからお試しください',
    IMAGE_CORRUPTED: '画像ファイルが破損しています。再度アップロードしてください',
    NSFW_DETECTED: '不適切なコンテンツが検出されました。適切な画像をアップロードしてください',
    INVALID_CONTENT: '画像コンテンツが要件を満たしていません。別の画像を選択してください',
    RATE_LIMIT_EXCEEDED: '月間無料クォータが上限に達しました',
    DAILY_LIMIT_EXCEEDED: '日間無料クォータが上限に達しました',
    MONTHLY_LIMIT_EXCEEDED: '月間無料クォータが上限に達しました',
    NETWORK_ERROR: 'ネットワーク接続の問題です。ネットワークを確認してください',
    NETWORK_TIMEOUT: 'ネットワークリクエストがタイムアウトしました。もう一度お試しください',
    NETWORK_UNREACHABLE: 'ネットワークに到達できません。接続を確認してください',
    AUTH_REQUIRED: '先にログインしてください',
    AUTH_EXPIRED: 'ログインが期限切れです。再度ログインしてください',
    AUTH_INVALID: 'ログイン情報が無効です。再度ログインしてください',
    DATABASE_ERROR: 'システムが一時的に利用できません。後でもう一度お試しください',
    REDIS_ERROR: 'システムが一時的に利用できません。後でもう一度お試しください',
    CONFIGURATION_ERROR: 'システム設定エラーです。サポートにお問い合わせください',
    UNKNOWN_ERROR: '処理中にエラーが発生しました。もう一度お試しください',
  }
};

export const errorSuggestions = {
  'zh-TW': {
    REPLICATE_API_ERROR: ['等待幾分鐘後重試', '檢查網路連線', '聯絡客服'],
    REPLICATE_QUOTA_EXCEEDED: ['等待配額重置', '升級到付費計劃', '聯絡客服'],
    REPLICATE_MODEL_UNAVAILABLE: ['稍後重試', '使用其他圖片', '聯絡客服'],
    REPLICATE_INVALID_INPUT: ['檢查圖片格式', '轉換為 JPG 或 PNG', '重新上傳'],
    PROCESSING_TIMEOUT: ['壓縮圖片大小', '使用較低解析度', '稍後重試'],
    PROCESSING_FAILED: ['重新上傳圖片', '檢查圖片品質', '稍後重試'],
    INVALID_IMAGE_FORMAT: ['轉換為 JPG 格式', '轉換為 PNG 格式', '使用其他圖片'],
    IMAGE_TOO_LARGE: ['壓縮圖片', '降低解析度', '使用其他圖片'],
    IMAGE_CORRUPTED: ['重新下載圖片', '使用其他圖片', '檢查檔案完整性'],
    NSFW_DETECTED: ['確保圖片內容合適', '使用其他圖片', '閱讀使用條款'],
    INVALID_CONTENT: ['選擇其他圖片', '確保內容合規', '閱讀使用條款'],
    RATE_LIMIT_EXCEEDED: ['升級到付費計劃', '等待下月重置', '邀請朋友獲得更多次數'],
    DAILY_LIMIT_EXCEEDED: ['等待明日重置', '升級到付費計劃', '邀請朋友獲得更多次數'],
    MONTHLY_LIMIT_EXCEEDED: ['等待下月重置', '升級到付費計劃', '邀請朋友獲得更多次數'],
    NETWORK_ERROR: ['檢查網路連線', '稍後重試', '嘗試重新整理頁面'],
    NETWORK_TIMEOUT: ['檢查網路速度', '稍後重試', '嘗試重新整理頁面'],
    NETWORK_UNREACHABLE: ['檢查網路連線', '嘗試其他網路', '聯絡網路服務商'],
    AUTH_REQUIRED: ['點擊登入按鈕', '使用 Google 登入', '聯絡客服'],
    AUTH_EXPIRED: ['重新登入', '清除瀏覽器快取', '聯絡客服'],
    AUTH_INVALID: ['重新登入', '檢查登入資訊', '聯絡客服'],
    DATABASE_ERROR: ['稍後重試', '重新整理頁面', '聯絡客服'],
    REDIS_ERROR: ['稍後重試', '重新整理頁面', '聯絡客服'],
    CONFIGURATION_ERROR: ['聯絡客服', '稍後重試', '檢查系統狀態'],
    UNKNOWN_ERROR: ['重新整理頁面重試', '聯絡客服支援', '檢查網路連線'],
  },
  en: {
    REPLICATE_API_ERROR: ['Wait a few minutes and try again', 'Check network connection', 'Contact support'],
    REPLICATE_QUOTA_EXCEEDED: ['Wait for quota reset', 'Upgrade to paid plan', 'Contact support'],
    REPLICATE_MODEL_UNAVAILABLE: ['Try again later', 'Use a different image', 'Contact support'],
    REPLICATE_INVALID_INPUT: ['Check image format', 'Convert to JPG or PNG', 'Upload again'],
    PROCESSING_TIMEOUT: ['Compress image size', 'Use lower resolution', 'Try again later'],
    PROCESSING_FAILED: ['Upload image again', 'Check image quality', 'Try again later'],
    INVALID_IMAGE_FORMAT: ['Convert to JPG format', 'Convert to PNG format', 'Use a different image'],
    IMAGE_TOO_LARGE: ['Compress image', 'Reduce resolution', 'Use a different image'],
    IMAGE_CORRUPTED: ['Download image again', 'Use a different image', 'Check file integrity'],
    NSFW_DETECTED: ['Ensure appropriate content', 'Use a different image', 'Read terms of service'],
    INVALID_CONTENT: ['Choose a different image', 'Ensure compliant content', 'Read terms of service'],
    RATE_LIMIT_EXCEEDED: ['Upgrade to paid plan', 'Wait for next month reset', 'Invite friends for more credits'],
    DAILY_LIMIT_EXCEEDED: ['Wait for tomorrow reset', 'Upgrade to paid plan', 'Invite friends for more credits'],
    MONTHLY_LIMIT_EXCEEDED: ['Wait for next month reset', 'Upgrade to paid plan', 'Invite friends for more credits'],
    NETWORK_ERROR: ['Check network connection', 'Try again later', 'Try refreshing the page'],
    NETWORK_TIMEOUT: ['Check network speed', 'Try again later', 'Try refreshing the page'],
    NETWORK_UNREACHABLE: ['Check network connection', 'Try different network', 'Contact network provider'],
    AUTH_REQUIRED: ['Click login button', 'Use Google login', 'Contact support'],
    AUTH_EXPIRED: ['Login again', 'Clear browser cache', 'Contact support'],
    AUTH_INVALID: ['Login again', 'Check login information', 'Contact support'],
    DATABASE_ERROR: ['Try again later', 'Refresh page', 'Contact support'],
    REDIS_ERROR: ['Try again later', 'Refresh page', 'Contact support'],
    CONFIGURATION_ERROR: ['Contact support', 'Try again later', 'Check system status'],
    UNKNOWN_ERROR: ['Refresh page and try again', 'Contact support', 'Check network connection'],
  },
  ja: {
    REPLICATE_API_ERROR: ['数分待ってから再試行', 'ネットワーク接続を確認', 'サポートに連絡'],
    REPLICATE_QUOTA_EXCEEDED: ['クォータリセットを待つ', '有料プランにアップグレード', 'サポートに連絡'],
    REPLICATE_MODEL_UNAVAILABLE: ['後でもう一度試す', '別の画像を使用', 'サポートに連絡'],
    REPLICATE_INVALID_INPUT: ['画像形式を確認', 'JPG または PNG に変換', '再度アップロード'],
    PROCESSING_TIMEOUT: ['画像サイズを圧縮', '低解像度を使用', '後でもう一度試す'],
    PROCESSING_FAILED: ['画像を再度アップロード', '画像品質を確認', '後でもう一度試す'],
    INVALID_IMAGE_FORMAT: ['JPG 形式に変換', 'PNG 形式に変換', '別の画像を使用'],
    IMAGE_TOO_LARGE: ['画像を圧縮', '解像度を下げる', '別の画像を使用'],
    IMAGE_CORRUPTED: ['画像を再ダウンロード', '別の画像を使用', 'ファイル整合性を確認'],
    NSFW_DETECTED: ['適切なコンテンツを確保', '別の画像を使用', '利用規約を読む'],
    INVALID_CONTENT: ['別の画像を選択', '準拠したコンテンツを確保', '利用規約を読む'],
    RATE_LIMIT_EXCEEDED: ['有料プランにアップグレード', '来月のリセットを待つ', '友達を招待してクレジットを獲得'],
    DAILY_LIMIT_EXCEEDED: ['明日のリセットを待つ', '有料プランにアップグレード', '友達を招待してクレジットを獲得'],
    MONTHLY_LIMIT_EXCEEDED: ['来月のリセットを待つ', '有料プランにアップグレード', '友達を招待してクレジットを獲得'],
    NETWORK_ERROR: ['ネットワーク接続を確認', '後でもう一度試す', 'ページを更新してみる'],
    NETWORK_TIMEOUT: ['ネットワーク速度を確認', '後でもう一度試す', 'ページを更新してみる'],
    NETWORK_UNREACHABLE: ['ネットワーク接続を確認', '別のネットワークを試す', 'ネットワークプロバイダーに連絡'],
    AUTH_REQUIRED: ['ログインボタンをクリック', 'Google ログインを使用', 'サポートに連絡'],
    AUTH_EXPIRED: ['再度ログイン', 'ブラウザキャッシュをクリア', 'サポートに連絡'],
    AUTH_INVALID: ['再度ログイン', 'ログイン情報を確認', 'サポートに連絡'],
    DATABASE_ERROR: ['後でもう一度試す', 'ページを更新', 'サポートに連絡'],
    REDIS_ERROR: ['後でもう一度試す', 'ページを更新', 'サポートに連絡'],
    CONFIGURATION_ERROR: ['サポートに連絡', '後でもう一度試す', 'システム状態を確認'],
    UNKNOWN_ERROR: ['ページを更新して再試行', 'サポートに連絡', 'ネットワーク接続を確認'],
  }
};

export const getErrorDetails = (error: any, language: Language = 'zh-TW'): ErrorDetails => {
  const timestamp = new Date().toISOString();
  
  // Replicate API 相关错误
  if (error.message?.includes('Replicate API error')) {
    return {
      code: errorCodes.REPLICATE_API_ERROR,
      message: error.message,
      userMessage: errorMessages[language].REPLICATE_API_ERROR,
      retryable: true,
      suggestions: errorSuggestions[language].REPLICATE_API_ERROR,
      severity: 'medium',
      category: 'api',
      timestamp
    };
  }

  if (error.message?.includes('quota') || error.message?.includes('Quota')) {
    return {
      code: errorCodes.REPLICATE_QUOTA_EXCEEDED,
      message: error.message,
      userMessage: errorMessages[language].REPLICATE_QUOTA_EXCEEDED,
      retryable: false,
      suggestions: errorSuggestions[language].REPLICATE_QUOTA_EXCEEDED,
      severity: 'high',
      category: 'api',
      timestamp
    };
  }

  if (error.message?.includes('model') || error.message?.includes('Model')) {
    return {
      code: errorCodes.REPLICATE_MODEL_UNAVAILABLE,
      message: error.message,
      userMessage: errorMessages[language].REPLICATE_MODEL_UNAVAILABLE,
      retryable: true,
      suggestions: errorSuggestions[language].REPLICATE_MODEL_UNAVAILABLE,
      severity: 'medium',
      category: 'api',
      timestamp
    };
  }

  // 处理相关错误
  if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
    return {
      code: errorCodes.PROCESSING_TIMEOUT,
      message: error.message,
      userMessage: errorMessages[language].PROCESSING_TIMEOUT,
      retryable: true,
      suggestions: errorSuggestions[language].PROCESSING_TIMEOUT,
      severity: 'medium',
      category: 'processing',
      timestamp
    };
  }

  if (error.message?.includes('failed') || error.message?.includes('Failed')) {
    return {
      code: errorCodes.PROCESSING_FAILED,
      message: error.message,
      userMessage: errorMessages[language].PROCESSING_FAILED,
      retryable: true,
      suggestions: errorSuggestions[language].PROCESSING_FAILED,
      severity: 'medium',
      category: 'processing',
      timestamp
    };
  }

  if (error.message?.includes('format') || error.message?.includes('Format')) {
    return {
      code: errorCodes.INVALID_IMAGE_FORMAT,
      message: error.message,
      userMessage: errorMessages[language].INVALID_IMAGE_FORMAT,
      retryable: false,
      suggestions: errorSuggestions[language].INVALID_IMAGE_FORMAT,
      severity: 'low',
      category: 'validation',
      timestamp
    };
  }

  if (error.message?.includes('large') || error.message?.includes('size')) {
    return {
      code: errorCodes.IMAGE_TOO_LARGE,
      message: error.message,
      userMessage: errorMessages[language].IMAGE_TOO_LARGE,
      retryable: false,
      suggestions: errorSuggestions[language].IMAGE_TOO_LARGE,
      severity: 'low',
      category: 'validation',
      timestamp
    };
  }

  // NSFW 检测
  if (error.message?.includes('NSFW')) {
    return {
      code: errorCodes.NSFW_DETECTED,
      message: error.message,
      userMessage: errorMessages[language].NSFW_DETECTED,
      retryable: false,
      suggestions: errorSuggestions[language].NSFW_DETECTED,
      severity: 'high',
      category: 'validation',
      timestamp
    };
  }

  // 速率限制
  if (error.message?.includes('generations will renew')) {
    return {
      code: errorCodes.RATE_LIMIT_EXCEEDED,
      message: error.message,
      userMessage: errorMessages[language].RATE_LIMIT_EXCEEDED,
      retryable: false,
      suggestions: errorSuggestions[language].RATE_LIMIT_EXCEEDED,
      severity: 'medium',
      category: 'rate_limit',
      timestamp
    };
  }

  if (error.message?.includes('daily') || error.message?.includes('Daily')) {
    return {
      code: errorCodes.DAILY_LIMIT_EXCEEDED,
      message: error.message,
      userMessage: errorMessages[language].DAILY_LIMIT_EXCEEDED,
      retryable: false,
      suggestions: errorSuggestions[language].DAILY_LIMIT_EXCEEDED,
      severity: 'medium',
      category: 'rate_limit',
      timestamp
    };
  }

  if (error.message?.includes('monthly') || error.message?.includes('Monthly')) {
    return {
      code: errorCodes.MONTHLY_LIMIT_EXCEEDED,
      message: error.message,
      userMessage: errorMessages[language].MONTHLY_LIMIT_EXCEEDED,
      retryable: false,
      suggestions: errorSuggestions[language].MONTHLY_LIMIT_EXCEEDED,
      severity: 'medium',
      category: 'rate_limit',
      timestamp
    };
  }

  // 网络错误
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return {
      code: errorCodes.NETWORK_ERROR,
      message: error.message,
      userMessage: errorMessages[language].NETWORK_ERROR,
      retryable: true,
      suggestions: errorSuggestions[language].NETWORK_ERROR,
      severity: 'medium',
      category: 'network',
      timestamp
    };
  }

  if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
    return {
      code: errorCodes.NETWORK_TIMEOUT,
      message: error.message,
      userMessage: errorMessages[language].NETWORK_TIMEOUT,
      retryable: true,
      suggestions: errorSuggestions[language].NETWORK_TIMEOUT,
      severity: 'medium',
      category: 'network',
      timestamp
    };
  }

  // 认证错误
  if (error.message?.includes('login') || error.message?.includes('Login')) {
    return {
      code: errorCodes.AUTH_REQUIRED,
      message: error.message,
      userMessage: errorMessages[language].AUTH_REQUIRED,
      retryable: false,
      suggestions: errorSuggestions[language].AUTH_REQUIRED,
      severity: 'medium',
      category: 'auth',
      timestamp
    };
  }

  // 系统错误
  if (error.message?.includes('database') || error.message?.includes('Database')) {
    return {
      code: errorCodes.DATABASE_ERROR,
      message: error.message,
      userMessage: errorMessages[language].DATABASE_ERROR,
      retryable: true,
      suggestions: errorSuggestions[language].DATABASE_ERROR,
      severity: 'high',
      category: 'system',
      timestamp
    };
  }

  if (error.message?.includes('redis') || error.message?.includes('Redis')) {
    return {
      code: errorCodes.REDIS_ERROR,
      message: error.message,
      userMessage: errorMessages[language].REDIS_ERROR,
      retryable: true,
      suggestions: errorSuggestions[language].REDIS_ERROR,
      severity: 'high',
      category: 'system',
      timestamp
    };
  }

  // 默认错误
  return {
    code: errorCodes.UNKNOWN_ERROR,
    message: error.message || 'Unknown error',
    userMessage: errorMessages[language].UNKNOWN_ERROR,
    retryable: true,
    suggestions: errorSuggestions[language].UNKNOWN_ERROR,
    severity: 'medium',
    category: 'system',
    timestamp
  };
};

export const logError = (error: ErrorDetails, context?: any) => {
  console.error('Error occurred:', {
    code: error.code,
    message: error.message,
    userMessage: error.userMessage,
    severity: error.severity,
    category: error.category,
    context,
    timestamp: error.timestamp
  });
  
  // 可以发送到错误追踪服务
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'error', {
      error_code: error.code,
      error_message: error.message,
      error_severity: error.severity,
      error_category: error.category
    });
  }
};

// 错误报告功能
export const reportError = async (error: ErrorDetails, additionalContext?: any) => {
  try {
    const reportData = {
      ...error,
      context: {
        ...error.context,
        ...additionalContext,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        timestamp: new Date().toISOString()
      }
    };

    const response = await fetch('/api/error-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      console.error('Failed to report error:', response.statusText);
    }

    return response.ok;
  } catch (reportError) {
    console.error('Error reporting error:', reportError);
    return false;
  }
};

// 增强的错误日志功能
export const logErrorWithReport = async (error: ErrorDetails, context?: any) => {
  // 本地日志
  logError(error, context);
  
  // 远程报告（仅对中等到严重错误）
  if (error.severity === 'medium' || error.severity === 'high' || error.severity === 'critical') {
    await reportError(error, context);
  }
};

// 错误恢复策略
export const getErrorRecoveryStrategy = (error: ErrorDetails): {
  action: 'retry' | 'fallback' | 'user_intervention' | 'system_intervention';
  delay?: number;
  maxAttempts?: number;
} => {
  switch (error.category) {
    case 'network':
      return {
        action: 'retry',
        delay: 2000,
        maxAttempts: 3
      };
    
    case 'api':
      if (error.severity === 'high' || error.severity === 'critical') {
        return {
          action: 'system_intervention',
          delay: 5000,
          maxAttempts: 2
        };
      }
      return {
        action: 'retry',
        delay: 3000,
        maxAttempts: 2
      };
    
    case 'validation':
      return {
        action: 'user_intervention'
      };
    
    case 'rate_limit':
      return {
        action: 'user_intervention'
      };
    
    case 'system':
      return {
        action: 'system_intervention',
        delay: 10000,
        maxAttempts: 1
      };
    
    default:
      return {
        action: 'retry',
        delay: 1000,
        maxAttempts: 1
      };
  }
};

// 错误预防检查
export const performErrorPreventionChecks = async (): Promise<{
  network: boolean;
  api: boolean;
  storage: boolean;
}> => {
  const checks = {
    network: false,
    api: false,
    storage: false
  };

  try {
    // 网络连接检查
    const networkResponse = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    checks.network = networkResponse.ok;
  } catch (error) {
    console.warn('Network check failed:', error);
  }

  try {
    // API 可用性检查
    const apiResponse = await fetch('/api/health');
    const healthData = await apiResponse.json();
    checks.api = healthData.status === 'ok';
  } catch (error) {
    console.warn('API check failed:', error);
  }

  try {
    // 存储检查
    if (typeof window !== 'undefined') {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
      checks.storage = true;
    }
  } catch (error) {
    console.warn('Storage check failed:', error);
  }

  return checks;
};

// 自动重试机制
export class ErrorRetryManager {
  private retryConfig: ErrorRetryConfig;
  private retryHistory = new Map<string, number>();

  constructor(config: Partial<ErrorRetryConfig> = {}) {
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxDelay: 10000,
      ...config
    };
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    errorKey?: string
  ): Promise<T> {
    const key = errorKey || 'default';
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        const errorDetails = getErrorDetails(error);
        
        // 如果错误不可重试，直接抛出
        if (!errorDetails.retryable) {
          throw error;
        }

        console.warn(`Retry attempt ${attempt} failed:`, errorDetails);
        
        if (attempt < this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
            this.retryConfig.maxDelay
          );
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // 记录重试历史
    this.retryHistory.set(key, (this.retryHistory.get(key) || 0) + 1);
    throw lastError!;
  }

  getRetryCount(key: string): number {
    return this.retryHistory.get(key) || 0;
  }

  clearRetryHistory(): void {
    this.retryHistory.clear();
  }

  shouldRetry(error: ErrorDetails): boolean {
    return error.retryable && this.getRetryCount(error.code) < this.retryConfig.maxRetries;
  }
}

// 错误聚合和分析
export class ErrorAnalytics {
  private errors: ErrorDetails[] = [];
  private maxErrors = 1000; // 最多保存1000个错误

  addError(error: ErrorDetails): void {
    this.errors.push(error);
    
    // 保持错误列表在限制内
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }

  getErrorStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    byCode: Record<string, number>;
    recentErrors: ErrorDetails[];
  } {
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byCode: Record<string, number> = {};

    this.errors.forEach(error => {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
      byCode[error.code] = (byCode[error.code] || 0) + 1;
    });

    return {
      total: this.errors.length,
      byCategory,
      bySeverity,
      byCode,
      recentErrors: this.errors.slice(-10) // 最近10个错误
    };
  }

  getMostCommonErrors(limit: number = 5): Array<{ code: string; count: number }> {
    const stats = this.getErrorStats();
    return Object.entries(stats.byCode)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// 全局错误分析实例
export const errorAnalytics = new ErrorAnalytics();

// 添加 gtag 类型定义
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: {
        error_code?: string;
        error_message?: string;
        error_severity?: string;
        error_category?: string;
      }
    ) => void;
  }
} 