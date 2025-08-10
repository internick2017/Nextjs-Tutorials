// Global Error Handler Utility

export interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
  stack?: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED', true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN', true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 409, 'CONFLICT', true, context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true);
  }
}

// Error logging service
export class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment = process.env.NODE_ENV === 'development';

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  async logError(error: Error | AppError, context?: Record<string, unknown>): Promise<void> {
    const errorDetails: ErrorDetails = {
      message: error.message,
      code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
      statusCode: error instanceof AppError ? error.statusCode : 500,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        ...(error instanceof AppError ? error.context : {}),
      },
    };

    // Log to console in development
    if (this.isDevelopment) {
      console.error('🚨 Error Details:', errorDetails);
    }

    // In production, you would send this to your error tracking service
    // Examples: Sentry, LogRocket, Bugsnag, DataDog, etc.
    try {
      await this.sendToErrorTrackingService(errorDetails);
    } catch (loggingError) {
      console.error('Failed to log error to tracking service:', loggingError);
    }
  }

  private async sendToErrorTrackingService(errorDetails: ErrorDetails): Promise<void> {
    // Mock implementation - replace with your actual error tracking service
    if (this.isDevelopment) {
      console.log('📊 Would send to error tracking service:', {
        service: 'Sentry/LogRocket/Bugsnag',
        errorDetails,
      });
    }

    // Example implementations:
    // Sentry.captureException(error, { extra: errorDetails });
    // LogRocket.captureException(error);
    // Bugsnag.notify(error, { metaData: errorDetails });
  }
}

// API Error Handler
export function createApiErrorResponse(
  error: Error | AppError,
  requestId?: string
): ApiErrorResponse {
  const isAppError = error instanceof AppError;
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    success: false,
    error: isAppError ? error.code : 'INTERNAL_ERROR',
    message: isAppError ? error.message : 'An unexpected error occurred',
    code: isAppError ? error.code : 'INTERNAL_ERROR',
    details: isDevelopment ? {
      stack: error.stack,
      ...(isAppError ? error.context : {}),
    } : undefined,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

// Async error handler wrapper
export function asyncHandler<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const logger = ErrorLogger.getInstance();
      await logger.logError(error as Error, {
        function: fn.name,
        arguments: args,
      });
      throw error;
    }
  };
}

// Client-side error handler
export function handleClientError(error: Error, context?: Record<string, unknown>): void {
  const logger = ErrorLogger.getInstance();
  logger.logError(error, {
    ...context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  });
}

// Validation helpers
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validatePositiveNumber(value: number, fieldName: string): void {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
}

// Error boundary helper
export function getErrorBoundaryProps(error: Error) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    title: 'Something went wrong',
    message: isDevelopment 
      ? error.message 
      : 'We encountered an unexpected error. Please try again.',
    showDetails: isDevelopment,
    errorDetails: isDevelopment ? {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    } : undefined,
  };
}