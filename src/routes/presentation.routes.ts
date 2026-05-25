// import { Router } from "express";
// import multer from "multer";
// import { PresentationController } from "@/controllers/presentation.controller";
// import { AuthMiddleware } from "@/middlewares/auth-middleware";

// const router = Router();
// const presentationController = new PresentationController();
// const authMiddleware = new AuthMiddleware();
// const upload = multer({ storage: multer.memoryStorage() });

// // All routes require authentication
// router.post(
//   "/v1/upload",
//   authMiddleware.execute,
//   upload.single("file"),
//   presentationController.upload,
// );
// router.get("/v1", authMiddleware.execute, presentationController.getAll);
// router.get("/v1/:id", authMiddleware.execute, presentationController.getById);
// router.get(
//   "/v1/:id/status",
//   authMiddleware.execute,
//   presentationController.getStatus,
// );
// router.get(
//   "/v1/:id/download",
//   authMiddleware.execute,
//   presentationController.download,
// );
// router.delete("/v1/:id", authMiddleware.execute, presentationController.delete);

// export default router;

import { Router } from "express";
import multer from "multer";
import { PresentationController } from "@/controllers/presentation.controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import {
  uploadPresentationSchema,
  presentationByIdSchema,
  downloadPresentationSchema,
} from "@/schema/presentation";

const router = Router();
const presentationController = new PresentationController();
const authMiddleware = new AuthMiddleware();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/v1/upload",
  authMiddleware.execute,
  upload.single("file"),
  validateSchema(uploadPresentationSchema),
  presentationController.upload,
);

router.get(
  "/v1",
  authMiddleware.execute,
  presentationController.getAll,
);

router.get(
  "/v1/:id",
  authMiddleware.execute,
  validateSchema(presentationByIdSchema),
  presentationController.getById,
);

router.get(
  "/v1/:id/status",
  authMiddleware.execute,
  validateSchema(presentationByIdSchema),
  presentationController.getStatus,
);

router.get(
  "/v1/:id/download",
  authMiddleware.execute,
  validateSchema(downloadPresentationSchema),
  presentationController.download,
);

router.delete(
  "/v1/:id",
  authMiddleware.execute,
  validateSchema(presentationByIdSchema),
  presentationController.delete,
);

export default router;