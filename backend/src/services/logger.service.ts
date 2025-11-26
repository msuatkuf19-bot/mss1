import fs from 'fs';
import path from 'path';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  }

  private writeToFile(level: LogLevel, message: string) {
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.logDir, `${level}-${date}.log`);
    
    fs.appendFile(filename, message, (err) => {
      if (err) console.error('Log yazma hatası:', err);
    });
  }

  info(message: string, meta?: any) {
    const formatted = this.formatMessage('info', message, meta);
    console.log('\x1b[36m%s\x1b[0m', formatted); // Cyan
    this.writeToFile('info', formatted);
  }

  warn(message: string, meta?: any) {
    const formatted = this.formatMessage('warn', message, meta);
    console.warn('\x1b[33m%s\x1b[0m', formatted); // Yellow
    this.writeToFile('warn', formatted);
  }

  error(message: string, meta?: any) {
    const formatted = this.formatMessage('error', message, meta);
    console.error('\x1b[31m%s\x1b[0m', formatted); // Red
    this.writeToFile('error', formatted);
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, meta);
      console.debug('\x1b[35m%s\x1b[0m', formatted); // Magenta
      this.writeToFile('debug', formatted);
    }
  }

  http(method: string, url: string, statusCode: number, responseTime: number) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    this.info(message);
  }
}

export const logger = new Logger();
