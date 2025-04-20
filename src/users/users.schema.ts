import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";

export const usersTable = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }),
	username: text("username", { length: 32 }).unique().notNull(),
	password: text("password").notNull(),
});

const _userInsertSchema = createInsertSchema(usersTable);
const _userSelectSchema = createSelectSchema(usersTable);

export const createUser = t.Omit(_userInsertSchema, ["id"]);
export type CreateUserDTO = Static<typeof createUser>;

export const loginUser = t.Omit(_userInsertSchema, ["id"]);
export type LoginUserDTO = Static<typeof loginUser>;

export const getUser = _userSelectSchema;
export type GetUserDTO = Static<typeof getUser>;
