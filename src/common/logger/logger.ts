import { LoggerService } from '@nestjs/common';
import pino from 'pino';

const MAX_LOG_LENGTH = 2000;

export class Logger implements LoggerService {
  private pinoLogger = pino();

  log(message: any, ...optionalParams: any[]) {
    this.pinoLogger.info(this.truncateMessage(message), ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.pinoLogger.error(this.truncateMessage(message), ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.pinoLogger.warn(this.truncateMessage(message), ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.pinoLogger.debug(this.truncateMessage(message), ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.pinoLogger.trace(this.truncateMessage(message), ...optionalParams);
  }

  private truncateMessage(message: string): string {
    if (message.length > MAX_LOG_LENGTH) {
      return `${message.substring(0, MAX_LOG_LENGTH)}... ${message.length - MAX_LOG_LENGTH} more characters`;
    }
    return message;
  }
}
