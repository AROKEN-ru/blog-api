import { AppError } from "@/common/errors";
import { PostsRepository } from "@/posts/posts.repository";

export const getPostByIdUseCase = async (id: number) => {
	const post = await PostsRepository.getPostById(id);
	if (!post) {
		throw new AppError("Post not found", 404);
	}

	return post;
};
