export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(errorCode: string, statusCode: number, message: string) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
