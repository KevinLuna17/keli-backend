import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import {
  CreateTransactionQuerySchema,
  CreateTransactionSchema,
  ListTransactionsQuerySchema,
  TransactionIdParamSchema,
  UpdateTransactionSchema,
} from "./transaction.schema";
import * as transactionService from "./transaction.service";
import { TransactionRecord } from "./transaction.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(CreateTransactionQuerySchema, req.query);
    const body = parseSchema(CreateTransactionSchema, req.body);

    const transaction = await transactionService.createTransaction(
      userId,
      query.workspaceId,
      body,
    );

    const response: ApiSuccessResponse<TransactionRecord> = {
      data: transaction,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function listTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(ListTransactionsQuerySchema, req.query);

    const result = await transactionService.listTransactions(userId, query);

    const response: ApiPaginatedResponse<TransactionRecord> = {
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(TransactionIdParamSchema, req.params);

    const transaction = await transactionService.getTransactionById(
      userId,
      params.id,
    );

    const response: ApiSuccessResponse<TransactionRecord> = {
      data: transaction,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(TransactionIdParamSchema, req.params);
    const body = parseSchema(UpdateTransactionSchema, req.body);

    const transaction = await transactionService.updateTransaction(
      userId,
      params.id,
      body,
    );

    const response: ApiSuccessResponse<TransactionRecord> = {
      data: transaction,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(TransactionIdParamSchema, req.params);

    await transactionService.deleteTransaction(userId, params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
