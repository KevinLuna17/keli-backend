import { db } from "../../db";
import { usersTable } from "../../db/schema/usersSchema";
import { eq } from "drizzle-orm";

export const findById = async (id: string) => {
    return db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
};

export const create = async (data: {
    id: string;
    email: string;
    name?: string;
    imageUrl?: string;
}) => {
    await db.insert(usersTable).values(data);
};
