import { verifyPassword } from "@/auth/hash";
import { AppError } from "@/common/errors";
import { UsersRepository } from "@/users/users.repository";
import type { LoginUserDTO } from "@/users/users.schema";

export const loginUseCase = async (userData: LoginUserDTO) => {
	const user = await UsersRepository.findUserByUsername(userData.username);
	if (!user) {
		throw new AppError("User not found", 400);
	}

	const isPasswordValid = await verifyPassword(
		userData.password,
		user.password,
	);
	if (!isPasswordValid) {
		throw new AppError("Invalid password", 400);
	}

	return {
		id: user.id,
		username: user.username,
	};
};
