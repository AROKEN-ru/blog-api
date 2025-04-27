import { PostsRepository } from "@/posts/posts.repository";
import type { PaginationRequest } from "@/types/pagination";

export const getAllPostsUseCase = async (
	paginationRequest: PaginationRequest,
) => {
	return await PostsRepository.getAllPosts(paginationRequest);
};
