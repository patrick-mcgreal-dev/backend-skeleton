import { Router, Request, Response } from "express";
import uploadRouter from "./upload";

const router = Router();

// ==================================== unprotected routes

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// ==================================== protected routes

router.use("/upload", uploadRouter);

export default router;
