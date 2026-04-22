import { Router } from "express";

import authRouter from "./auth/index";
import transactionsRouter from "./transactions/index";

const router = Router();

router.use('/auth', authRouter);
router.use('/transactions', transactionsRouter);

export default router;