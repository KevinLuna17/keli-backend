import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { categoriesTable } from "../../db/schema/categories-schema";
import { mapCategoryRowToRecord } from "./category.mapper";
import { CategoryRecord } from "./category.types";

export async function findById(id: string): Promise<CategoryRecord | null> {
  const [row] = await db
    .select()
    .from(categoriesTable)
    .where(
      and(eq(categoriesTable.id, id), isNull(categoriesTable.deleted_at)),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapCategoryRowToRecord(row);
}
