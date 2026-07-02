import { z } from "zod";
import { CATEGORY_ICON_KEYS } from "../../shared/constants/category-icon-keys";

export const CategoryIconKeySchema = z.enum(CATEGORY_ICON_KEYS);

export const ListCategoriesQuerySchema = z
  .object({
    workspaceId: z.uuid("workspaceId must be a valid UUID"),
  })
  .strict();

export type ListCategoriesQueryDto = z.infer<typeof ListCategoriesQuerySchema>;

/** Reserved for category create/update endpoints. */
export const CreateCategoryBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(["income", "expense"]),
  iconKey: CategoryIconKeySchema.optional(),
});

export type CreateCategoryBodyDto = z.infer<typeof CreateCategoryBodySchema>;
