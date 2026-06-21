import { z } from "zod";

const transactionTypeSchema = z.enum(["income", "expense"]);

const categoryIdSchema = z.uuid("categoryId must be a valid UUID");

const amountInCentsSchema = z
  .number({ error: "amountInCents is required" })
  .int("amountInCents must be an integer")
  .positive("amountInCents must be greater than 0");

const descriptionSchema = z
  .string({ error: "description is required" })
  .trim()
  .min(2, "description must be at least 2 characters")
  .max(255, "description must be at most 255 characters");

const notesSchema = z
  .string()
  .max(1000, "notes must be at most 1000 characters");

const transactionDateSchema = z.coerce.date({
  error: "transactionDate is required",
});

export const CreateTransactionSchema = z
  .object({
    categoryId: categoryIdSchema,
    type: transactionTypeSchema,
    amountInCents: amountInCentsSchema,
    description: descriptionSchema,
    notes: notesSchema.nullable().optional(),
    transactionDate: transactionDateSchema,
  })
  .strict();

export const UpdateTransactionSchema = z
  .object({
    categoryId: categoryIdSchema.optional(),
    type: transactionTypeSchema.optional(),
    amountInCents: amountInCentsSchema.optional(),
    description: descriptionSchema.optional(),
    notes: notesSchema.nullable().optional(),
    transactionDate: transactionDateSchema.optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const ListTransactionsQuerySchema = z
  .object({
    workspaceId: z.uuid("workspaceId must be a valid UUID"),
    type: transactionTypeSchema.optional(),
    categoryId: categoryIdSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce
      .number()
      .int("page must be an integer")
      .positive("page must be greater than 0")
      .optional(),
    limit: z.coerce
      .number()
      .int("limit must be an integer")
      .positive("limit must be greater than 0")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    {
      message: "startDate must be before or equal to endDate",
      path: ["endDate"],
    },
  );

export const TransactionIdParamSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
  })
  .strict();

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type ListTransactionsQueryDto = z.infer<
  typeof ListTransactionsQuerySchema
>;
export type TransactionIdParamDto = z.infer<typeof TransactionIdParamSchema>;
