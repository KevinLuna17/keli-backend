import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as categoryController from "./category.controller";

const router = Router();

router.get("/", authMiddleware, categoryController.listCategories);

export default router;
