import { hashPassword } from "@/auth/hash";
import { AppError } from "@/common/errors";
import { UsersRepository } from "@/users/users.repository";
import type { CreateUserDTO } from "@/users/users.schema";

export const registerUseCase = async (userToCreate: CreateUserDTO) => {
	const existingUser = await UsersRepository.findUserByUsername(
		userToCreate.username,
	);
	if (existingUser) {
		throw new AppError("User already exists", 400);
	}

	const hashedPassword = await hashPassword(userToCreate.password);

	const newUser = await UsersRepository.createUser({
		username: userToCreate.username,
		password: hashedPassword,
	});

	return newUser;
};
