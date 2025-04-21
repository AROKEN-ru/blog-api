import { PostsRepository } from "@/posts/posts.repository";

export const getAllPostsUseCase = async () => {
	return await PostsRepository.getAllPosts();
};
