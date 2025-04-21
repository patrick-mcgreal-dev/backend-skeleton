import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong.",
  });
};

export default globalErrorHandler;
