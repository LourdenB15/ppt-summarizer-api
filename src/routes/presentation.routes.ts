import { Router } from "express";
import { PresentationController } from "@/controllers/presentation.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { uploadMiddleware } from "@/middlewares/upload-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { downloadSchema, idSchema, uploadSchema } from "@/schema/presentation";

const router = Router();
const presentationController = new PresentationController();
const authMiddleware = new AuthMiddleware();

// All routes require authentication
router.post(
  "/v1/upload",
  authMiddleware.execute,
  uploadMiddleware,
  validateSchema(uploadSchema),
  presentationController.upload,
);
router.get("/v1", authMiddleware.execute, presentationController.getAll);
router.get(
  "/v1/:id",
  authMiddleware.execute,
  validateSchema(idSchema),
  presentationController.getById,
);
router.get(
  "/v1/:id/status",
  authMiddleware.execute,
  validateSchema(idSchema),
  presentationController.getStatus,
);
router.get(
  "/v1/:id/download",
  authMiddleware.execute,
  validateSchema(downloadSchema),
  presentationController.download,
);
router.delete(
  "/v1/:id",
  authMiddleware.execute,
  validateSchema(idSchema),
  presentationController.delete,
);

export default router;
