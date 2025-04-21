import express from "express";
import multer from "multer";
import { authMiddleware } from "@middleware/auth";
import AppError from "@utils/AppError";
import { UploadController } from "@controllers/upload";

const fileMaxSize = process.env.FILE_MAX_SIZE;
if (!fileMaxSize || isNaN(Number(fileMaxSize))) {
  throw new Error("Environment is missing FILE_MAX_SIZE");
}

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new AppError(
      "INVALID_FILE_TYPE",
      400,
      "Invalid file type. Only video files are allowed.",
    );
    cb(error);
  }
};

const upload = multer({
  dest: process.env.UPLOADS_DIR,
  limits: { fileSize: parseInt(fileMaxSize) },
  fileFilter,
});

const router = express.Router();
const uploadController = new UploadController();

router.use(authMiddleware);
router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
