import Elysia from "elysia";

import { authGuard } from "@/auth/auth.guard";
import { createPostUseCase } from "./application/create-post.usecase";
import { deletePostByIdUseCase } from "./application/delete-post-by-id.usecase";
import { getAllPostsUseCase } from "./application/get-all-posts.usecase";
import { updatePostByIdUseCase } from "./application/update-post-by-id.usecase";
import { createPost, updatePost } from "./posts.schema";

const publicRoutes = new Elysia().get(
	"/",
	async () => {
		const posts = await getAllPostsUseCase();
		return {
			message: "Posts fetched successfully",
			posts,
		};
	},
	{
		detail: {
			description: "Get all posts.",
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
			await deletePostByIdUseCase(Number(id), Number(user.id));
			return {
				message: "Post deleted successfully",
			};
		},
		{
			detail: {
				description: "Delete a post by ID.",
			},
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body, user }) => {
			const updatedPost = await updatePostByIdUseCase(
				Number(id),
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
