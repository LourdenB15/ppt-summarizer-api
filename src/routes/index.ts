import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import presentationRoutes from "@/routes/presentation.routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);

// Presentation Endpoints
router.use("/presentations", presentationRoutes);

export default router;
