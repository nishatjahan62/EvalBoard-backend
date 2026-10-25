
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import projectsRoutes from "../modules/projects/projects.routes.js";
import reviewsRoutes from "../modules/reviews/reviews.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectsRoutes);
router.use("/reviews", reviewsRoutes);

export default router;
