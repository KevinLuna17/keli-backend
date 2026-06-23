import { and, eq, isNull } from "drizzle-orm";
import { db, DbClient, DbTransaction } from "../../db";
import { categoriesTable } from "../../db/schema/categories-schema";
import { isUniqueViolation } from "../../shared/utils/is-unique-violation";
import { resolveIconKeyForCategory } from "./category-icon.utils";
import { mapCategoryRowToRecord } from "./category.mapper";
import { CategoryRecord, CreateCategoryInput } from "./category.types";

type DbExecutor = DbClient | DbTransaction;

export async function findById(
  id: string,
  executor: DbExecutor = db,
): Promise<CategoryRecord | null> {
  const [row] = await executor
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

export async function listByWorkspaceId(
  workspaceId: string,
  executor: DbExecutor = db,
): Promise<CategoryRecord[]> {
  const rows = await executor
    .select()
    .from(categoriesTable)
    .where(
      and(
        eq(categoriesTable.workspaceId, workspaceId),
        isNull(categoriesTable.deleted_at),
      ),
    )
    .orderBy(categoriesTable.name);

  return rows.map(mapCategoryRowToRecord);
}

export async function create(
  input: CreateCategoryInput,
  executor: DbExecutor = db,
): Promise<CategoryRecord> {
  const iconKey = resolveIconKeyForCategory({
    name: input.name,
    type: input.type,
    iconKey: input.iconKey,
  });

  const [row] = await executor
    .insert(categoriesTable)
    .values({
      workspaceId: input.workspaceId,
      name: input.name,
      type: input.type,
      iconKey,
    })
    .returning();

  return mapCategoryRowToRecord(row);
}

export async function createMany(
  inputs: CreateCategoryInput[],
  executor: DbExecutor = db,
): Promise<CategoryRecord[]> {
  const created: CategoryRecord[] = [];

  for (const input of inputs) {
    try {
      const category = await create(input, executor);
      created.push(category);
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
    }
  }

  return created;
}
