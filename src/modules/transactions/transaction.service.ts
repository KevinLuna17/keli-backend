import { AppError } from "../../shared/errors/app-error";
import * as categoryService from "../categories/category.service";
import * as workspaceService from "../workspaces/workspace.service";
import * as transactionsRepository from "./transaction.repository";
import {
  CreateTransactionDto,
  ListTransactionsQueryDto,
  UpdateTransactionDto,
} from "./transaction.schema";
import {
  ListTransactionsResult,
  TransactionRecord,
  TransactionType,
} from "./transaction.types";

async function assertCategoryInWorkspace(
  categoryId: string,
  workspaceId: string,
  expectedType?: TransactionType,
): Promise<void> {
  const category = await categoryService.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  if (category.workspaceId !== workspaceId) {
    throw new AppError(
      "Category does not belong to this workspace",
      400,
      "CATEGORY_WORKSPACE_MISMATCH",
    );
  }

  if (expectedType !== undefined && category.type !== expectedType) {
    throw new AppError(
      "Category type does not match transaction type",
      400,
      "CATEGORY_TYPE_MISMATCH",
    );
  }
}

async function getAccessibleTransaction(
  userId: string,
  transactionId: string,
): Promise<TransactionRecord> {
  const transaction =
    await transactionsRepository.getTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  await workspaceService.assertWorkspaceAccess(userId, transaction.workspaceId);

  return transaction;
}

export async function createTransaction(
  userId: string,
  workspaceId: string,
  input: CreateTransactionDto,
): Promise<TransactionRecord> {
  await workspaceService.assertWorkspaceAccess(userId, workspaceId);
  await assertCategoryInWorkspace(input.categoryId, workspaceId, input.type);

  return transactionsRepository.createTransaction({
    workspaceId,
    categoryId: input.categoryId,
    createdBy: userId,
    type: input.type,
    amountInCents: input.amountInCents,
    description: input.description,
    transactionDate: input.transactionDate,
  });
}

export async function getTransactionById(
  userId: string,
  transactionId: string,
): Promise<TransactionRecord> {
  return getAccessibleTransaction(userId, transactionId);
}

export async function listTransactions(
  userId: string,
  query: ListTransactionsQueryDto,
): Promise<ListTransactionsResult> {
  await workspaceService.assertWorkspaceAccess(userId, query.workspaceId);

  if (query.categoryId) {
    await assertCategoryInWorkspace(query.categoryId, query.workspaceId);
  }

  return transactionsRepository.listTransactions({
    workspaceId: query.workspaceId,
    type: query.type,
    categoryId: query.categoryId,
    startDate: query.startDate,
    endDate: query.endDate,
    page: query.page,
    limit: query.limit,
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  input: UpdateTransactionDto,
): Promise<TransactionRecord> {
  const transaction = await getAccessibleTransaction(userId, transactionId);

  if (input.categoryId !== undefined || input.type !== undefined) {
    const effectiveCategoryId = input.categoryId ?? transaction.categoryId;
    const effectiveType = input.type ?? transaction.type;
    await assertCategoryInWorkspace(effectiveCategoryId, transaction.workspaceId, effectiveType);
  }

  const updatedTransaction = await transactionsRepository.updateTransaction(
    transactionId,
    input,
  );

  if (!updatedTransaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  return updatedTransaction;
}

export async function deleteTransaction(
  userId: string,
  transactionId: string,
): Promise<TransactionRecord> {
  await getAccessibleTransaction(userId, transactionId);

  const deletedTransaction =
    await transactionsRepository.softDeleteTransaction(transactionId);

  if (!deletedTransaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  return deletedTransaction;
}
