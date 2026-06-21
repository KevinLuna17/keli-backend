import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as transactionController from "./transaction.controller";

const router = Router();

router.use(authMiddleware);

/**
 * Transactions API
 *
 * Base path: /api/transactions
 * All routes require authentication (Clerk).
 *
 * POST /
 *   Create a transaction in a workspace.
 *   Query: workspaceId (UUID, required)
 *   Body: { categoryId, type, amountInCents, description, notes?, transactionDate }
 *   Response: 201 { data: TransactionRecord }
 *
 * GET /
 *   List transactions for a workspace with optional filters and pagination.
 *   Query: workspaceId (required), type?, categoryId?, startDate?, endDate?, page?, limit?
 *   Response: 200 { data: TransactionRecord[], meta: { total, page, limit } }
 *
 * GET /:id
 *   Get a single transaction by id.
 *   Params: id (UUID)
 *   Response: 200 { data: TransactionRecord }
 *
 * PATCH /:id
 *   Update editable fields on a transaction.
 *   Params: id (UUID)
 *   Body: at least one of { categoryId?, type?, amountInCents?, description?, notes?, transactionDate? }
 *   Response: 200 { data: TransactionRecord }
 *
 * DELETE /:id
 *   Soft delete a transaction.
 *   Params: id (UUID)
 *   Response: 204 (no body)
 */
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.listTransactions);
router.get("/:id", transactionController.getTransactionById);
router.patch("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
