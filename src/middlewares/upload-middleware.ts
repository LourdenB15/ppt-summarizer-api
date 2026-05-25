import multer from "multer";
import { Request, Response, NextFunction } from "express";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          code: 400,
          status: "error",
          message: "Only one file can be uploaded at a time.",
        });
      }
      return res.status(400).json({
        code: 400,
        status: "error",
        message: err.message,
      });
    }
    next(err);
  });
};
