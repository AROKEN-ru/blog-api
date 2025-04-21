import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";

import { usersTable } from "@/users/users.schema";

export const postsTable = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title", { length: 128 }).notNull(),
	content: text("content").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
});

const _postsInsertSchema = createInsertSchema(postsTable);
const _postsSelectSchema = createSelectSchema(postsTable);

export const createPost = t.Pick(_postsInsertSchema, ["title", "content"]);
export type CreatePostDTO = Static<typeof createPost>;

export const updatePost = t.Partial(
	t.Pick(_postsInsertSchema, ["title", "content"]),
);
export type UpdatePostDTO = Static<typeof updatePost>;
