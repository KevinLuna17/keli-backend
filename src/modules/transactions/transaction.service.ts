import { AppError } from "../../shared/errors/app-error";
import * as categoriesRepository from "../categories/categories.repository";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import * as transactionsRepository from "./transaction.repository";
import {
  CreateTransactionDto,
  ListTransactionsQueryDto,
  UpdateTransactionDto,
} from "./transaction.schema";
import {
  ListTransactionsResult,
  TransactionRecord,
} from "./transaction.types";

async function assertWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.ownerId !== userId) {
    throw new AppError(
      "You do not have access to this workspace",
      403,
      "WORKSPACE_ACCESS_DENIED",
    );
  }
}

async function assertCategoryInWorkspace(
  categoryId: string,
  workspaceId: string,
): Promise<void> {
  const category = await categoriesRepository.findById(categoryId);

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

  await assertWorkspaceAccess(userId, transaction.workspaceId);

  return transaction;
}

export async function createTransaction(
  userId: string,
  workspaceId: string,
  input: CreateTransactionDto,
): Promise<TransactionRecord> {
  await assertWorkspaceAccess(userId, workspaceId);
  await assertCategoryInWorkspace(input.categoryId, workspaceId);

  return transactionsRepository.createTransaction({
    workspaceId,
    categoryId: input.categoryId,
    createdBy: userId,
    type: input.type,
    amountInCents: input.amountInCents,
    description: input.description,
    notes: input.notes ?? null,
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
  await assertWorkspaceAccess(userId, query.workspaceId);

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

  if (input.categoryId) {
    await assertCategoryInWorkspace(input.categoryId, transaction.workspaceId);
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
