import { Request, Response, NextFunction } from "express";
import AppError from "@utils/AppError";
import { getUploadQueue } from "../queue";

export class UploadController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return next(new AppError("FILE_NOT_UPLOADED", 400, "No file uploaded"));
    }

    try {
      const uploadQueue = getUploadQueue();

      await uploadQueue.add("process-file", {
        filename: req.file.filename,
        filepath: req.file.path,
        originalname: req.file.originalname,
      });

      res.json({ message: "File uploaded successfully", file: req.file });
    } catch (err) {
      return next(new AppError("QUEUE_ERROR", 500, "Failed to enqueue job"));
    }
  }
}
