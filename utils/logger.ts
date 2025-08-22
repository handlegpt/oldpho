// 日志级别枚举
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// 日志配置
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  maxFileSize: number; // MB
  maxFiles: number;
}

// 默认配置
const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: false,
  maxFileSize: 10,
  maxFiles: 5
};

class SecureLogger {
  private config: LoggerConfig;
  private logBuffer: string[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // 格式化日志消息
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };
    return JSON.stringify(logEntry);
  }

  // 清理敏感数据
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'authorization',
      'cookie', 'session', 'credential', 'private'
    ];

    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sensitive => 
        lowerKey.includes(sensitive)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // 写入日志
  private writeLog(level: LogLevel, levelName: string, message: string, data?: any): void {
    if (level > this.config.level) {
      return;
    }

    const formattedMessage = this.formatMessage(levelName, message, data);

    // 控制台输出
    if (this.config.enableConsole) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                           level === LogLevel.WARN ? 'warn' : 
                           level === LogLevel.INFO ? 'info' : 'log';
      
      console[consoleMethod](formattedMessage);
    }

    // 添加到缓冲区
    this.logBuffer.push(formattedMessage);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }
  }

  // 错误日志
  error(message: string, data?: any): void {
    this.writeLog(LogLevel.ERROR, 'ERROR', message, data);
  }

  // 警告日志
  warn(message: string, data?: any): void {
    this.writeLog(LogLevel.WARN, 'WARN', message, data);
  }

  // 信息日志
  info(message: string, data?: any): void {
    this.writeLog(LogLevel.INFO, 'INFO', message, data);
  }

  // 调试日志
  debug(message: string, data?: any): void {
    this.writeLog(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  // 安全事件日志
  securityEvent(event: string, details?: any): void {
    const securityMessage = `SECURITY_EVENT: ${event}`;
    this.writeLog(LogLevel.WARN, 'SECURITY', securityMessage, details);
  }

  // 获取日志缓冲区
  getLogBuffer(): string[] {
    return [...this.logBuffer];
  }

  // 清空日志缓冲区
  clearBuffer(): void {
    this.logBuffer = [];
  }

  // 更新配置
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建全局日志实例
export const logger = new SecureLogger();

// 便捷的日志函数
export const logError = (message: string, data?: any) => logger.error(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logSecurity = (event: string, details?: any) => logger.securityEvent(event, details);

// 生产环境安全的console.log替换
export const safeLog = {
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message, ...args);
    } else {
      logger.error(message, args.length > 0 ? args : undefined);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(message, ...args);
    } else {
      logger.warn(message, args.length > 0 ? args : undefined);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(message, ...args);
    } else {
      logger.info(message, args.length > 0 ? args : undefined);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(message, ...args);
    } else {
      logger.debug(message, args.length > 0 ? args : undefined);
    }
  }
};
