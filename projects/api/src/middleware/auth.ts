import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { UserService } from "../services/UserService";
import { User } from "@packages/db";

const userService = UserService.getUserService();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("NO_BEARER_TOKEN", 401, "Unauthorised"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const user: User | null = await userService.findByToken(token);

    if (!user) {
      return next(new AppError("INVALID_TOKEN", 401, "Unauthorised"));
    }

    res.locals.user = user;
    next();
  } catch (err) {
    return next(new AppError("AUTH_ERROR", 500, "Something went wrong"));
  }
};
