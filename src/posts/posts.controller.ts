import Elysia, { t } from "elysia";

import { authGuard } from "@/auth/auth.guard";
import { createPostUseCase } from "./application/create-post.usecase";
import { deletePostByIdUseCase } from "./application/delete-post-by-id.usecase";
import { getAllPostsUseCase } from "./application/get-all-posts.usecase";
import { getPostByIdUseCase } from "./application/get-post-by-id.usecase";
import { updatePostByIdUseCase } from "./application/update-post-by-id.usecase";
import { createPost, updatePost } from "./posts.schema";

const publicRoutes = new Elysia()
	.get(
		"/",
		async ({ query: { page, limit } }) => {
			const data = await getAllPostsUseCase({ page, limit });
			return {
				message: "Posts fetched successfully",
				...data,
			};
		},
		{
			query: t.Object({
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
			}),
			detail: {
				description: "Get all posts.",
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			const post = await getPostByIdUseCase(id);
			return {
				message: "Post fetched successfully",
				post,
			};
		},
		{
			params: t.Object({
				id: t.Number(),
			}),
			detail: {
				description: "Get a post by ID.",
			},
		},
	);

const privateRoutes = new Elysia()
	.use(authGuard)
	.post(
		"/",
		async ({ body, user }) => {
			const newPost = await createPostUseCase(body, Number(user.id));
			return {
				message: "Post created successfully",
				post: newPost,
			};
		},
		{
			body: createPost,
			detail: {
				description: "Create a new post.",
			},
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, user }) => {
			await deletePostByIdUseCase(id, Number(user.id));
			return {
				message: "Post deleted successfully",
			};
		},
		{
			params: t.Object({
				id: t.Number(),
			}),
			detail: {
				description: "Delete a post by ID.",
			},
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body, user }) => {
			const updatedPost = await updatePostByIdUseCase(
				id,
				Number(user.id),
				body,
			);
			return {
				message: "Post updated successfully",
				post: updatedPost,
			};
		},
		{
			body: updatePost,
			params: t.Object({
				id: t.Number(),
			}),
			detail: {
				description: "Update a post by ID.",
			},
		},
	);

export const postsController = new Elysia({
	prefix: "/posts",
	detail: { tags: ["Posts"] },
})
	.use(publicRoutes)
	.use(privateRoutes);
