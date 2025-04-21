import { AppError } from "@/common/errors";
import { PostsRepository } from "@/posts/posts.repository";

export const deletePostByIdUseCase = async (id: number, userId: number) => {
	const post = await PostsRepository.deletePostById(id, userId);
	if (!post) {
		throw new AppError("Post not found", 404);
	}

	return post;
};
