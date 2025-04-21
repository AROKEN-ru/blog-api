import { AppError } from "@/common/errors";
import { PostsRepository } from "@/posts/posts.repository";
import type { UpdatePostDTO } from "@/posts/posts.schema";

export const updatePostByIdUseCase = async (
	id: number,
	userId: number,
	postToUpdate: UpdatePostDTO,
) => {
	const post = await PostsRepository.updatePostById(id, userId, postToUpdate);
	if (!post) {
		throw new AppError("Post not found", 404);
	}

	return post;
};
