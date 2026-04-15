import { Router } from "express";
import { listTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } from "./transactionsController";

const router = Router();

router.get('/', listTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;