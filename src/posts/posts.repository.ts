import { count, desc, eq } from "drizzle-orm";

import { AppError } from "@/common/errors";
import { db } from "@/db";
import type { PaginationRequest } from "@/types/pagination";
import { usersTable } from "@/users/users.schema";
import {
	type CreatePostDTO,
	type UpdatePostDTO,
	postsTable,
} from "./posts.schema";

export class PostsRepository {
	static async createPost(postToCreate: CreatePostDTO & { userId: number }) {
		const [createdPost] = await db
			.insert(postsTable)
			.values({
				...postToCreate,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning({ id: postsTable.id });

		return await this.selectPostWithAuthor(createdPost.id);
	}

	static async getAllPosts({ page = 1, limit = 12 }: PaginationRequest) {
		const maxLimit = 50;
		const safeLimit = Math.min(limit, maxLimit);
		const offset = (page - 1) * safeLimit;

		const posts = await db
			.select({
				id: postsTable.id,
				title: postsTable.title,
				content: postsTable.content,
				createdAt: postsTable.createdAt,
				updatedAt: postsTable.updatedAt,
				author: {
					id: usersTable.id,
					username: usersTable.username,
				},
			})
			.from(postsTable)
			.innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
			.orderBy(desc(postsTable.createdAt))
			.limit(safeLimit)
			.offset(offset);

		const totalPosts = await db
			.select({ count: count(postsTable.id) })
			.from(postsTable)
			.innerJoin(usersTable, eq(postsTable.userId, usersTable.id));

		const total = totalPosts[0]?.count ?? 0;

		return {
			posts,
			pagination: {
				page,
				limit: safeLimit,
				totalPages: Math.ceil(total / safeLimit),
			},
		};
	}

	static async getPostById(id: number) {
		return await this.selectPostWithAuthor(id);
	}

	static async deletePostById(id: number, userId: number) {
		const post = await db
			.select()
			.from(postsTable)
			.where(eq(postsTable.id, id));

		if (!post.length) {
			return null;
		}

		if (post[0].userId !== userId) {
			throw new AppError("You cannot delete this post", 403);
		}

		const [deletedPost] = await db
			.delete(postsTable)
			.where(eq(postsTable.id, id))
			.returning();
		return deletedPost;
	}

	static async updatePostById(
		id: number,
		userId: number,
		postToUpdate: UpdatePostDTO,
	) {
		const post = await db
			.select()
			.from(postsTable)
			.where(eq(postsTable.id, id));

		if (!post.length) {
			return null;
		}

		if (post[0].userId !== userId) {
			throw new AppError("You cannot update this post", 403);
		}

		const [updatedPost] = await db
			.update(postsTable)
			.set({
				...postToUpdate,
				updatedAt: new Date(),
			})
			.where(eq(postsTable.id, id))
			.returning();

		return updatedPost;
	}

	private static async selectPostWithAuthor(postId: number) {
		const [post] = await db
			.select({
				id: postsTable.id,
				title: postsTable.title,
				content: postsTable.content,
				createdAt: postsTable.createdAt,
				updatedAt: postsTable.updatedAt,
				author: {
					id: usersTable.id,
					username: usersTable.username,
				},
			})
			.from(postsTable)
			.innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
			.where(eq(postsTable.id, postId));

		return post;
	}
}
