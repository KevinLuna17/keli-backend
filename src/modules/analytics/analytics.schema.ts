import { z } from "zod";

export const DashboardQuerySchema = z
  .object({
    workspaceId: z.uuid("workspaceId must be a valid UUID"),
  })
  .strict();

export type DashboardQueryDto = z.infer<typeof DashboardQuerySchema>;
