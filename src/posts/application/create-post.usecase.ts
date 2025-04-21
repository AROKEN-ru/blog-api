import { PostsRepository } from "@/posts/posts.repository";
import type { CreatePostDTO } from "@/posts/posts.schema";

export const createPostUseCase = async (
	postToCreate: CreatePostDTO,
	userId: number,
) => {
	return await PostsRepository.createPost({
		...postToCreate,
		userId,
	});
};
